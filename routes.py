from flask import render_template, redirect, url_for
from app import app, session

#Define ruta principal
@app.route("/")
#Define la funcion Principal
def main():
    #Verifica que haya sesion
    if 'nombre' in session:
        return render_template('inicio.html')
    else:
        return render_template('ingresar.html')

#Define la ruta de index
@app.route("/inicio")
def inicio():
    global ronda, torneo
    if 'nombre' in session:
        #----------------------Nombre del torneo! importante para toda la temporada----------------
        torneo = 'bolivia2022'
        ahora=datetime.datetime.now().isoformat()
        ronda=fechas(ahora)
       
        return render_template('inicio.html', ronda=ronda)
        
    else:
        return render_template('ingresar.html')

@app.route("/ligas")
def ligas():
    
    global ronda, torneo
    if 'nombre' in session:
        #----------------------Nombre del torneo! importante para toda la temporada----------------
        torneo = 'bolivia2022'
        ahora=datetime.datetime.now().isoformat()
        ronda=fechas(ahora)
        ses=session['id']
        ligas=info_liga(ses)
        return render_template('ligas.html', ronda=ronda, ligas=ligas)
        
    else:
        return render_template('ingresar.html')

#Widget SportMonks
@app.route("/live")
def live():
    
    if 'nombre' in session:
        
        return render_template('live.html', ronda=ronda)
        
    else:
        return render_template('ingresar.html')

#definimos la ruta para el registro---------------------------------------------------------
@app.route("/registrar", methods=["GET", "POST"])
def registrar():
    
    if (request.method=="GET"):
        #accesso no concedido 
        if 'nombre' in session:
            return render_template('inicio.html')
        else:
            return render_template("ingresar.html")
    else:
        nombre    = request.form['nmNombreRegistro']
        correo    = request.form['nmCorreoRegistro']
        username  = request.form['nmUsernameRegistro']
        password  = request.form['nmPasswordRegistro']
        password_encode = password.encode("utf-8")
        password_encriptado = bcrypt.hashpw(password_encode, semilla)
        
        app.config['MYSQL_DB'] = 'dbapp'
        #prepara el query
        sQuery = "INSERT into Login (correo, password, nombre, tipo) VALUES (%s, %s, %s, %s)"
        #crea cursor
        cur = mysql.connection.cursor()
        #Ejecuta
        cur.execute(sQuery, (correo,password_encriptado,nombre,'usuario'))
        mysql.connection.commit()

        #registra la sesion
        session['nombre'] = nombre
        lQuery = 'SELECT id FROM login WHERE correo = %s'
        cur.execute(lQuery,[correo])
        usuario = cur.fetchone()
        session['id'] = usuario[0] 
        
        return redirect(url_for('inicio'))

@app.route("/ingresar", methods=["GET","POST"])
def ingresar():
    app.config['MYSQL_DB'] = 'dbapp'
    if (request.method=="GET"):
        if 'nombre' in session:
            return render_template('inicio.html')
        else:
            return render_template('ingresar.html')
    else:
        correo    = request.form['nmCorreoLogin']
        password  = request.form['nmPasswordLogin']
        password_encode = password.encode("utf-8")
        cur = mysql.connection.cursor()
        sQuery = 'SELECT correo, password, nombre, id, tipo FROM login WHERE correo = %s'
        cur.execute(sQuery,[correo])
        usuario = cur.fetchone()
        
        mysql.connection.commit()

        #Verifica si obtuvo datos
        if (usuario !=None ):
            password_encriptado_encode = usuario[1].encode()
            print("password_encode:", password_encode)
            print("password_encriptado_encode:", password_encriptado_encode)
            if (bcrypt.checkpw(password_encode, password_encriptado_encode)):

                #registra la sesion
                session['nombre'] = usuario[2]
                session['correo'] = correo
                session['id'] = usuario[3]
                session['tipo']= usuario[4]
                return redirect(url_for('inicio'))
            else:
                #mensaje flash
                flash("El password no es correcto", "alert-info")

                #redirige a Ingresar
                return render_template('ingresar.html')
        else:
            flash("El correo no existe", "alert-info")
            return render_template('ingresar.html')

# Revisa si el usuario logueado tiene equipo creado o no------------------------------------
@app.route("/fantasy")
def fantasy():
    global torneo
    
    if 'nombre' in session:
        
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        sQuery = 'SELECT * FROM registrados WHERE login_id = %s'
        
        cur.execute(sQuery %(session['id']) )
        user_team = cur.fetchone()
        mysql.connection.commit()
        if user_team == None:
            
            return redirect(url_for('creaequipo'))
        else:
            
            
            return redirect(url_for('equipo'))    
    else:
        return render_template('ingresar.html')

# Bloque cración de equipo------------------------------------------------------------------
@app.route("/creaquipo", methods=["GET", "POST"])
def creaequipo():
    

    if 'nombre' in session:
        #return render_template('creaequipo.html')
        global P1,P2,D1,D2,D3,D4,D5,M1,M2,M3,M4,M5,A1,A2,A3,frecuencia,precio_equipo
        P1=P2=D1=D2=D3=D4=D5=M1=M2=M3=M4=M5=A1=A2=A3=precio_equipo=0
        frecuencia={}
        print('Variables reiniciadas')
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        pQuery="SELECT players_id,img,dname,pos,pts,precio,teams.name,teams.teams_id,teams.logo FROM players JOIN teams ON players.team=teams.teams_id"
        tQuery="SELECT * FROM teams"

        cur.execute(pQuery)
        jugadores=cur.fetchall()
        listjug=list()
        for jugad in jugadores:
            jugador = list(jugad)
            jugador[3]= abr_posi(jugador[3])
            
            listjug.append(jugador)
        cur.execute(tQuery)
        equipos=cur.fetchall()

        return render_template('creaequipo.html', jugadores=listjug, equipos=equipos)

        
        
    else:
        return render_template('ingresar.html')


@app.route("/ajaxfile",methods=["POST","GET"])
def ajaxfile():
    
    if request.method == 'POST':
        userid = request.form['userid']

        app.config['MYSQL_DB'] = torneo
        curs = mysql.connection.cursor()
        mQuery="""SELECT img,fullname,pos,teams.name,teams.teams_id,nacion,birthdate,height,weight,birthplace FROM 
                players JOIN teams ON players.team=teams.teams_id WHERE players_id=%s"""
        curs.execute(mQuery %userid)
        employeelist=curs.fetchall()

        
        dQuery="SELECT players_id,min,imb,gol,asi,ta,tr,pts,precio FROM players WHERE players_id=%s"
        curs.execute(dQuery %userid)
        totales=curs.fetchone()

        
        aQuery="SELECT monks_id,min,imbat,gol,asis,ta,tr,pts,precio FROM pts_bol2021 WHERE monks_id=%s"
        curs.execute(aQuery %userid)
        total=curs.fetchone()
        
        mysql.connection.commit()        
        
    return jsonify({'htmlresponse': render_template('response.html',employeelist=employeelist, totales =totales, total=total )})

@app.route("/ajaxadd",methods=["POST","GET"])
def ajaxadd():
    global P1,P2,D1,D2,D3,D4,D5,M1,M2,M3,M4,M5,A1,A2,A3,frecuencia,precio_equipo,dicequipo,torneo
    
    if request.method == 'POST':
        userid = request.form['userid']
        
        print(userid)

        if userid=='crear':
            fav= request.form['favorito']
            print(fav)
            if P1==0 or P2==0 or D1==0 or D2==0 or D3==0 or D4==0 or D5==0 or M1==0 or M2==0 or M3==0 or M4==0 or M5==0 or A1==0 or A2==0 or A3==0:
                return jsonify(msg ="Debes elejir a los 15 jugadores de la plantilla")
                
            else:
                if precio_equipo > 90:
                    msgp = 'Te pasaste! tu planilla es de '+str(precio_equipo)+'UFB, tu presupuesto total es de 80UFB.'
                    return jsonify(msg=msgp)
                    
                else:
                    app.config['MYSQL_DB'] = torneo
                    name = request.form['nameteam']
                    print(name)
                    sQuery = """INSERT into registrados (name,login_id,team,fav) 
                    VALUES (%s,%s,%s,%s)"""
                    fQuery = """INSERT into ultimo (name,login_id,team,fav) 
                    VALUES (%s,%s,%s,%s)"""
                    rQuery="INSERT INTO registrado_liga (registrado_id, liga_id) VALUES (%s,%s)"
                    ses=session['id']
                    #crea cursor
                    cur = mysql.connection.cursor()
                    dicequipo['suplentes']=P2,D5,M5,A3
                    equipo=json.dumps(dicequipo)
                    #Ejecuta
                    cur.execute(sQuery, (name,session['id'],equipo,fav))
                    cur.execute(fQuery, (name,session['id'],equipo,fav))
                    cur.execute(rQuery ,(ses,'2'))
                    cur.execute(rQuery ,(ses,'3'))

                    mysql.connection.commit()
                    creado=True
                    return jsonify(creado=creado)

        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        tQuery="""SELECT pos,teams.teams_id,teams.name,precio 
        FROM players JOIN teams ON players.team=teams.teams_id WHERE players_id=%s"""
        cur.execute(tQuery %userid)
        listajugador = cur.fetchone()
        teamid = listajugador[1]

        if teamid in frecuencia: 
            if frecuencia[teamid] == 3:
                print('ya tienes 3 jugadores de ', listajugador[2])
                mens = 'Ya tienes 3 jugadores de '+listajugador[2]+', reemplaza alguno'
                print(mens)
                return jsonify(msg=mens)
            else: frecuencia[teamid] += 1
        else: frecuencia[teamid] = 1



        if listajugador[0] == '1':
            
            if P1 == 0:
                P1 = userid
                POS="P1"
                dicequipo['P1']=userid
                
            else:
                if P2 == 0: 
                    P2 = userid
                    POS="P2"
                    dicequipo['P2']=userid
                else: 
                    return jsonify (msg = "Ya elegiste tus dos porteros, reemplaza alguno")
        elif listajugador[0] == '2':
            
            if D1 == 0:
                D1 = userid
                POS="D1"
                dicequipo['D1']=userid
            elif D2 == 0:
                D2 = userid
                POS="D2"  
                dicequipo['D2']=userid
            elif D3 == 0:
                D3 = userid
                POS="D3"
                dicequipo['D3']=userid
            elif D4 == 0: 
                D4 = userid
                POS="D4"
                dicequipo['D4']=userid
            elif D5 == 0:
                D5 = userid
                POS="D5"
                dicequipo['D5']=userid
            else: 
                return jsonify (msg = "Ya elegiste tus cinco defensores, reemplaza alguno")
        elif listajugador[0] == '3':
            
            if M1 == 0:
                M1 = userid
                POS="M1"
                dicequipo['M1']=userid
            elif M2 == 0:
                M2 = userid
                POS="M2"  
                dicequipo['M2']=userid
            elif M3 == 0:
                M3 = userid
                POS="M3"
                dicequipo['M3']=userid
            elif M4 == 0: 
                M4 = userid
                POS="M4"
                dicequipo['M4']=userid
            elif M5 == 0:
                M5 = userid
                POS="M5"
                dicequipo['M5']=userid
            else: 
                return jsonify (msg = "Ya elegiste tus cinco mediocampistas, reemplaza alguno")
        elif listajugador[0] == '4':
            
            if A1 == 0:
                A1 = userid
                POS="A1"
                dicequipo['A1']=userid
            elif A2 == 0:
                A2 = userid
                POS="A2"
                dicequipo['A2']=userid  
            elif A3 == 0:
                A3 = userid
                POS="A3"
                dicequipo['A3']=userid           
            else: 
                return jsonify (msg = "Ya elegiste tus tres delanteros, reemplaza alguno")
        
    else: return render_template("inicio.html")
    
    
    
    
    print(dicequipo)

    precio_equipo = precio_equipo + float(listajugador[3])
    return jsonify (POS=POS,price=precio_equipo)

@app.route("/ajaxrem",methods=["POST","GET"])
def ajaxrem():
    global P1,P2,D1,D2,D3,D4,D5,M1,M2,M3,M4,M5,A1,A2,A3,frecuencia,precio_equipo
    if request.method == 'POST':
        userpos = request.form['userpos']
        preciorem = request.form['price']
        teamrem = int(request.form['team'])
        frecuencia[teamrem] -= 1
        print(preciorem)
        precio_equipo = precio_equipo - float(preciorem)
        print(userpos, precio_equipo)
        if 'P1' == userpos: P1= 0
        elif 'P2' == userpos: P2= 0
        elif 'D1' == userpos: D1= 0
        elif 'D2' == userpos: D2= 0
        elif 'D3' == userpos: D3= 0
        elif 'D4' == userpos: D4= 0
        elif 'D5' == userpos: D5= 0
        elif 'M1' == userpos: M1= 0
        elif 'M2' == userpos: M2= 0
        elif 'M3' == userpos: M3= 0
        elif 'M4' == userpos: M4= 0
        elif 'M5' == userpos: M5= 0
        elif 'A1' == userpos: A1= 0
        elif 'A2' == userpos: A2= 0
        elif 'A3' == userpos: A3= 0
    return jsonify(msg='variable reiniciada')

# Bloque revision Puntos y cambios en equipo------------------------------------------------
@app.route("/puntos",methods=["POST","GET"])
def puntos():
    jugado=list()
    if 'nombre' in session:
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        sQuery = 'SELECT * FROM registrados WHERE login_id = %s'
        
        
        cur.execute(sQuery %(session['id']) )
        user_team = cur.fetchone()
        print ('equipo favorito:',user_team[3])
        fQuery="SELECT logo,name,teams_id FROM teams WHERE teams_id=%s"
        cur.execute(fQuery %user_team[3])
        fav=cur.fetchone()
        mysql.connection.commit()
        ses=session['id']
        ligas=info_liga(ses)
        pts=0
        if user_team == None:
            
            return redirect(url_for('creaequipo'))
        else:
            ant=-1
            jugado=carga_equipo(ant)
            escuadra=dict(jugado[16])
            supl=list(escuadra['suplentes'])
            for jug in jugado:
                juga=list(jug)
                print (juga[2])
                if str(juga[2]) in supl:
                    print('esta')
                    continue
                else:
                    try:
                        pts+=int(jug[5])
                    except:continue
            print(pts)
            return render_template('puntos.html',jP1=jugado[0],jP2=jugado[1],jD1=jugado[2],
            jD2=jugado[3],jD3=jugado[4],jD4=jugado[5],jD5=jugado[6],jM1=jugado[7],
            jM2=jugado[8],jM3=jugado[9],jM4=jugado[10],jM5=jugado[11],jA1=jugado[12],
            jA2=jugado[13],jA3=jugado[14],name_team=jugado[15],pts=pts,favorito=fav,ligas=ligas)
            
    else:
        return render_template('ingresar.html')


# Bloque revision Puntos y cambios en equipo------------------------------------------------
@app.route("/equipo",methods=["POST","GET"])
def equipo():
    jugado=list()
    if 'nombre' in session:
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        sQuery = 'SELECT * FROM registrados WHERE login_id = %s'
        
        cur.execute(sQuery %(session['id']) )
        user_team = cur.fetchone()
        mysql.connection.commit()
        if user_team == None:
            
            return redirect(url_for('creaequipo'))
        else:
            ant=-1
            jugado=carga_equipo(ant)

            return render_template('equipo.html',jP1=jugado[0],jP2=jugado[1],jD1=jugado[2],jD2=jugado[3],jD3=jugado[4],jD4=jugado[5], 
            jD5=jugado[6],jM1=jugado[7],jM2=jugado[8],jM3=jugado[9],jM4=jugado[10],jM5=jugado[11],jA1=jugado[12],jA2=jugado[13],jA3=jugado[14],name_team=jugado[15])
            
    else:
        return render_template('ingresar.html')


    jugado=list()
    if 'nombre' in session:
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        sQuery = 'SELECT * FROM registrados WHERE login_id = %s'
        
        cur.execute(sQuery %(format(login_id)) )
        user_team = cur.fetchone()
        mysql.connection.commit()
        if user_team == None:
            
            return redirect(url_for('creaequipo'))
        else:
            ant=-1
            jugado=carga_equipos(ant,login_id)

            return render_template('equipo.html',jP1=jugado[0],jP2=jugado[1],jD1=jugado[2],jD2=jugado[3],jD3=jugado[4],jD4=jugado[5], 
            jD5=jugado[6],jM1=jugado[7],jM2=jugado[8],jM3=jugado[9],jM4=jugado[10],jM5=jugado[11],jA1=jugado[12],jA2=jugado[13],jA3=jugado[14],name_team=jugado[15])
            
    else:
        return render_template('ingresar.html')

#Ruta para ver los equipos
@app.route("/t/<string:login_id>/")
def show_post(login_id):
    jugado=list()
    if 'nombre' in session:
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        sQuery = 'SELECT * FROM registrados WHERE login_id = %s'
        
        cur.execute(sQuery %(login_id) )
        user_team = cur.fetchone()
        mysql.connection.commit()
        if user_team == None:
            
            return redirect(url_for('creaequipo'))
        else:
            ant=-1
            jugado=carga_equipos(ant,login_id)

            return render_template('equipo.html',jP1=jugado[0],jP2=jugado[1],jD1=jugado[2],jD2=jugado[3],jD3=jugado[4],jD4=jugado[5], 
            jD5=jugado[6],jM1=jugado[7],jM2=jugado[8],jM3=jugado[9],jM4=jugado[10],jM5=jugado[11],jA1=jugado[12],jA2=jugado[13],jA3=jugado[14],name_team=jugado[15])
            
    else:
        return render_template('ingresar.html')

    

@app.route("/ajaxequipo",methods=["POST","GET"])
def ajaxequipo():
    global dicequipo,torneo
    app.config['MYSQL_DB'] = torneo
    sQuery = "SELECT name FROM registrados WHERE login_id = %s"
    #crea cursor
    cur = mysql.connection.cursor()
    #Ejecuta
    ses=session['id']
    
    cur.execute(sQuery %(ses))
    name=cur.fetchone()
    
    return jsonify(name_team = name, supl=dicequipo['suplentes'])

@app.route("/ajaxsubs",methods=["POST","GET"])
def ajaxsubs():
    global dicequipo
    return jsonify(form=dicequipo['form'])

#Bloque de transferencias------------------------------------------------------------------
@app.route("/transfer",methods=["POST","GET"])
def transfer():
    if 'nombre' in session:
        cero=0
        jugado=carga_equipo(cero)
        app.config['MYSQL_DB'] = torneo
        cur = mysql.connection.cursor()
        pQuery="SELECT players_id,img,dname,pos,pts,precio,teams.name,teams.teams_id,teams.logo FROM players JOIN teams ON players.team=teams.teams_id"
        
        cur.execute(pQuery)
        jugadores=cur.fetchall()
        listjug=list()
        for jugad in jugadores:
            jugador = list(jugad)
            jugador[3]= abr_posi(jugador[3])
            
            listjug.append(jugador)

        return render_template('transfer.html',jP1=jugado[0],jP2=jugado[1],
        jD1=jugado[2],jD2=jugado[3],jD3=jugado[4],jD4=jugado[5],jD5=jugado[6],
        jM1=jugado[7],jM2=jugado[8],jM3=jugado[9],jM4=jugado[10],jM5=jugado[11],
        jA1=jugado[12],jA2=jugado[13],jA3=jugado[14],name_team=jugado[15], jugadores=listjug)
        
        
    else:
        return render_template('ingresar.html')

@app.route("/ajaxtransfer",methods=["POST","GET"])
def ajaxtransfer():
    global dicequipo,torneo,ronda
    equipo=list()
    app.config['MYSQL_DB'] = torneo
    sQuery = "SELECT team,name FROM ultimo WHERE login_id = %s"
    fQuery = "SELECT %s FROM registrados WHERE login_id = %s"
    cur = mysql.connection.cursor()
    ses=session['id']
    rond='team_fecha_'+ronda
    cur.execute(fQuery %(rond,ses))
    plantilla=cur.fetchone()
    if plantilla == None:
        cur.execute(sQuery %(ses))
        plantilla=cur.fetchone()
   
    #dicequipo=json.loads(plantilla[0])
    cQuery = "SELECT name, fav, ligas FROM registrados WHERE login_id = %s"
    
    cur.execute(cQuery %(ses))
    datos=cur.fetchone()
    mysql.connection.commit()
    name=datos[0]

    posicion = request.form['POS']
    dicequipo[posicion]=0
    
    

    for k,v in dicequipo.items():
        if k!='suplentes':
            equipo.append(v)

    operacion = request.form['operacion']
    if operacion=='carga':
        return jsonify(equipo=equipo)
    
    
    
    P1=dicequipo['P1']; P2=dicequipo['P2']
    D1=dicequipo['D1'];D2=dicequipo['D2'];D3=dicequipo['D3'];D4=dicequipo['D4'];D5=dicequipo['D5']
    M1=dicequipo['M1'];M2=dicequipo['M2'];M3=dicequipo['M3'];M4=dicequipo['M4'];M5=dicequipo['M5']
    A1=dicequipo['A1'];A2=dicequipo['A2'];A3=dicequipo['A3']

@app.route("/ajaxchange",methods=["POST","GET"])
def ajaxchange():
    global dicequipo,torneo,ronda
    
    play_in = request.form['user_a']
    
    if play_in=='guardar':
        app.config['MYSQL_DB'] = torneo
        rond=str('team_fecha_'+ronda)
        sQuery= """UPDATE ultimo SET team = %s WHERE login_id = %s"""
        
        fQuery= """UPDATE registrados SET %s = '%s' WHERE login_id = %s"""
        print('ronda ajaxChange:',ronda)
        #crea cursor
        cur = mysql.connection.cursor()
        equipo=json.dumps(dicequipo)
        #Ejecuta
        cur.execute(sQuery, (equipo,session['id']))
        cur.execute(fQuery %(rond,equipo,session['id']))
        mysql.connection.commit()
        return jsonify(msg="Equipo guardado!")

    play_out = request.form['user_b']    
    suplentes= list(dicequipo['suplentes'])
    for suplente in suplentes:
        if suplente==play_out:
            suplentes.remove(suplente) 
    suplentes.append(play_in)
    dicequipo['suplentes']=suplentes
    #print(list(dicequipo.keys())[list(dicequipo.values()).index(play_in)])
    
    return jsonify(sub=dicequipo['suplentes'])


@app.route("/ajaxcompra",methods=["POST","GET"])
def ajaxcompra():
    global dicequipo,torneo,ronda
    pos=str()
    userid = request.form['userid']
    
    cur = mysql.connection.cursor()
    if userid=='crear':
        if dicequipo['P1']==0 or dicequipo['P2']==0 or dicequipo['D1']==0 or dicequipo['D2']==0 or dicequipo['D3']==0 or dicequipo['D4']==0 or dicequipo['D5']==0 or dicequipo['M1']==0 or dicequipo['M2']==0 or dicequipo['M3']==0 or dicequipo['M4']==0 or dicequipo['M5']==0 or dicequipo['A1']==0 or dicequipo['A2']==0 or dicequipo['A3']==0:
            return jsonify(msg ="Debes elejir a los 15 jugadores de la plantilla")
            
        else:
            if precio_equipo > 90:
                msgp = 'Te pasaste! tu planilla es de '+str(precio_equipo)+'UFB, tu presupuesto total es de 80UFB.'
                return jsonify(msg=msgp)
                
            else:
                app.config['MYSQL_DB'] = torneo
                sQuery= """UPDATE ultimo SET team = %s WHERE login_id = %s"""
                equipo=json.dumps(dicequipo)
                cur.execute(sQuery, (equipo,session['id']))
                creado= True
                return jsonify(creado= creado)
    
    print(dicequipo)
    for k,v in dicequipo.items():
        if v==0:
            dicequipo[k]=userid
            pos=k
    
    print(dicequipo, pos)
    return jsonify(pos=pos)
#------------------------------------------------------------------------------------------
# Bloque Administracion de Fantasy---------------------------------------------------------
@app.route("/adminGMD",methods=["POST","GET"])
def adminGMD():
    global torneo
    if 'nombre' in session:
        torneo = 'bolivia2022'
        if session['tipo']=='administrador':
            if request.method=='POST':
                print('entra')    
                league_id = request.form['API_league_ID']
                current=API_currents(league_id)
                print(current)
                stages=API_season(current['season'])
                teams=API_teams(current['season'])
                #season_id = request.form['API_season_ID']
                fixt=API_fixtures(current['season'])
                squads=API_squads(current['season'],teams)
                API_rounds()
                API_events()
                
                return render_template('adminGMD.html')
            else:
                
                return render_template('adminGMD.html')
        else:
            return render_template('inicio.html')
    else:
        return render_template('ingresar.html')

@app.route("/adminTarea",methods=["POST","GET"])
def adminTarea():
    img_change()
    precio()
    tpuntos()
    return render_template('adminGMD.html')

@app.route("/adminUPD",methods=["POST","GET"])
def adminUPD():
    rpuntos()
    return render_template('adminGMD.html')

@app.route("/adminLigas",methods=["POST","GET"])
def adminLigas():
    crea_ligas()
    return render_template('adminGMD.html')

@app.route("/adminTasks",methods=["POST","GET"])
def adminTasks():
    global torneo
    
    #Crea el objeto MySQL
    rondas=fecha_live()
    scheduler = BackgroundScheduler()
    ahora=datetime.datetime.now().isoformat()
    print(ahora)
    for ronda in rondas:
        inicio=str(ronda[0].isoformat()+'T11:00:00')
        fin=str(ronda[1].isoformat()+'T23:59:00')
        if ahora < fin:
            print('inicio:',inicio, 'fin',fin)
            scheduler.add_job(func=livescores, trigger="interval", seconds=120, start_date=inicio , end_date=fin)
        else:
            continue
            
    scheduler.print_jobs()
    scheduler.start()



    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())
    return render_template('adminGMD.html')


@app.route('/salir')
def salir():
    session.clear()
    return redirect(url_for('ingresar'))



//Script Formacion-->
    var form;
    var titu;
    var supl;
    var pres;
    var ses;
    var capi;
    $(document).ready(function(){
      
      console.log(ses);
      guardado=true;
        $.ajax({
              url: '/ajaxequipo',
              type: 'post',
              data: {ses:ses},
              success: function(response){ 
                supl = response.supl;
                presu=response.presu;
                capi = response.capi;
                
                $.each(supl, function(indice, elemento){
                  sup=$('.row_cancha').find('img[data-usr^="'+elemento+'"]').closest('.cuadro_contenedor');
                  sup_btn=$('.row_cancha').find('img[data-usr^="'+elemento+'"]').closest('.jugador_ico');
                  sup_btn.removeClass('cuadro_int');
                  sup_btn.addClass('cuadro_int_sup');
                  sup.appendTo('#suplente_'+indice);
                });
                img_cap=$(document).find("img[data-usr='"+capi+"']");
                cuadro_cap=img_cap.closest('.cuadro_contenedor');
                cuadro_cap.prepend("<img src='static/images/capitan.png' alt='capitan' id='img_capi' class='img-fluid rounded'  data-usr='"+capi+"'>");
                pres = presu;
                pres=pres.toFixed(1);
                $('#campopresupuesto').text(pres);
                if (pres<0){
                      $('#campopresupuesto').css("color", "red")
                    }

                  
              }
        });
    });


//Script Muestra suplentes-->
    function muestrasuplentes(){
      $('.cuadro_int_bench_des').toggle(800);
      };
    $(document).ready(function (){
      $('.cuadro_int_bench_des').hide();
      $('#bench').click(function(){
        muestrasuplentes();
      });
    })
    


//Script para mostrar modal con datos de jugador, y pasar datos al botonsus/botontransf-->
  
    var divid;
    var comodin = false;
    var debanca = false; 
    $(document).ready(function(){
      
      $('.jugador_ico').click(function(){
        debanca = false; 
        if (comodin == true){
          comodin = false;
          return false}
        $('.cuadro_int_bench_des').hide();
        var userid = $(this).find('#img_cambiada').data('usr');
        var userpos = $(this).find('#img_cambiada').data('pos');
        var userprice = $(this).find('#img_cambiada').data('price');
        var userpos_team= $(this).find('.img_reemplazo').attr('id');
        divid = $(this).closest('.cuadro_contenedor');
        if(userid==capi){
          $('.botonsus').addClass("disabledbutton");
          $('.botoncapitan').addClass("disabledbutton"); }
        else{
          $('.botonsus').removeClass("disabledbutton");
          $('.botoncapitan').removeClass("disabledbutton");}
        if($(this).hasClass('cuadro_int_sup')){
          debanca = true;
          $('.botoncapitan').addClass("disabledbutton");
        };
        $('.botonsus').attr("data-usr", userid);
        $('.botonsus').attr("data-pos", userpos);
        $('.botontransf').attr("data-usr", userid);
        $('.botontransf').attr("data-pos", userpos);
        $('.botontransf').attr("data-pt", userpos_team);
        $('.botontransf').attr("data-price", userprice);
        $('.botoncapitan').attr("data-usr", userid);
        
        $('#empModal').on('hidden.bs.modal', function() {
          $('.botonsus').removeAttr("data-usr");
          $('.botonsus').removeAttr("data-pos");
          $('.botontransf').removeAttr("data-usr");
          $('.botontransf').removeAttr("data-pos");
          $('.botontransf').removeAttr("data-price");
          $('.botoncapitan').removeAttr("data-usr");
          $('.botoncapitan').removeClass("disabledbutton");
          
        });
            $.ajax({
                url: '/ajaxfile',
                type: 'post',
                cache: false,
                data: {userid: userid},
                success: function(data){ 
                    $('.modal-body').html(data); 
                    $('.modal-body').append(data.htmlresponse);
                    $('#empModal').modal('show'); 
                }
            });   
          });
        });

//Script cuando se hace click en botonsus-->
$(document).ready(function(){
  $('.botonsus').click( function(){
     guardado=false;
     console.log('debanca' , debanca);
     var user = $(this).attr('data-usr');
     var userpos_a = $(this).attr('data-pos');       
     var sup_por = $('.cuadro_int_bench_des').find('img[data-pos^="P"]').closest('.suplente_int');
     var sup_def = $('.cuadro_int_bench_des').find('img[data-pos^="D"]').closest('.suplente_int');
     var sup_med = $('.cuadro_int_bench_des').find('img[data-pos^="M"]').closest('.suplente_int');
     var sup_ata = $('.cuadro_int_bench_des').find('img[data-pos^="A"]').closest('.suplente_int');
     comodin = true;
     var user_b; 
     var saltar_paso = false;
     var POS = 
     $('#empModal').on('hidden.bs.modal', function() {
         var user = undefined;
         var userpos_a = undefined;

       });
     if(debanca==false){
       if(userpos_a=='POR'){
         sup_ata.addClass("disabledbutton");
         sup_med.addClass("disabledbutton");
         sup_def.addClass("disabledbutton");
         $('.jugador_ico').on('click', function(){
           $(".cuadro_contenedor").removeClass("disabledbutton");
           sup_ata.removeClass("disabledbutton");
           sup_med.removeClass("disabledbutton");
           sup_def.removeClass("disabledbutton");
           $('.cuadro_int_bench_des').hide(800);
           
         })

       } 
       if(userpos_a=='DEF'){
         sup_por.addClass("disabledbutton");
         if(sup_def.length>=2){sup_med.addClass("disabledbutton");sup_ata.addClass("disabledbutton")}
       }
       if(userpos_a=='MED'){
         sup_por.addClass("disabledbutton");
         if(sup_med.length>=2){sup_def.addClass("disabledbutton");sup_ata.addClass("disabledbutton")}
       }
       if(userpos_a=='ATA'){
         sup_por.addClass("disabledbutton");
         if(sup_ata.length>=2){sup_def.addClass("disabledbutton");sup_med.addClass("disabledbutton")}
       }
       $('#empModal').modal('hide');
       muestrasuplentes();
       $(".row_cancha > .cuadro_contenedor").addClass("disabledbutton");
       divid.removeClass('disabledbutton');

       function change(){
         var entra=$(this).find('#img_cambiada').attr('data-pos');
         var user_b=$(this).find('#img_cambiada').attr('data-usr');
         var sup_entra=$(this).closest('.suplente_int')
         $(this).removeClass('cuadro_int_sup');
         $(this).addClass('cuadro_int');
         sup_entra.contents().appendTo('#row_'+entra);
         divid.find('.jugador_ico').removeClass('cuadro_int')
         divid.find('.jugador_ico').addClass('cuadro_int_sup')
         divid.appendTo(sup_entra);
         if(user==capi){
           capi=user_b;
           $('#img_capi').remove();
           $(this).prepend("<img src='static/images/capitan.png' alt='capitan' id='img_capi' class='img-fluid rounded'  data-usr='"+capi+"'>");
         }

         $.ajax({
         url: '/ajaxchange',
         type: 'post',
         data:  {user_a: user, user_b: user_b, capi:capi},
         success: function(){
         console.log('Jugador Cambiado');
         
         }
       });

       } 
       $('.jugador_ico').on('click', change);
       
     }
     else{
      img_cap=$(document).find("img[data-usr='"+capi+"']");
      cuadro_cap=img_cap.closest('.cuadro_contenedor');
      cuadro_cap.addClass("disabledbutton");
       if(userpos_a=='POR'){
         $('#row_ATA').addClass("disabledbutton");
         $('#row_MED').addClass("disabledbutton");
         $('#row_DEF').addClass("disabledbutton");
         $('.jugador_ico').on('click', function(){
           $(".cuadro_contenedor").removeClass("disabledbutton");
           $('#row_ATA').removeClass("disabledbutton");
           $('#row_MED').removeClass("disabledbutton");
           $('#row_DEF').removeClass("disabledbutton");
           $('#row_POR').removeClass("disabledbutton");
           $('.cuadro_int_bench_des').hide(800);
           
         })

       } 
       if(userpos_a=='DEF'){
         $('#row_POR').addClass("disabledbutton");
         if(sup_med.length>=2){$('#row_MED').addClass("disabledbutton")}
         if(sup_ata.length>=2){$('#row_ATA').addClass("disabledbutton")}
       }
       if(userpos_a=='MED'){
         $('#row_POR').addClass("disabledbutton");
         if(sup_def.length>=2){$('#row_DEF').addClass("disabledbutton")}
         if(sup_ata.length>=2){$('#row_ATA').addClass("disabledbutton")}
       }
       if(userpos_a=='ATA'){
         $('#row_POR').addClass("disabledbutton");
         if(sup_def.length>=2){$('#row_DEF').addClass("disabledbutton")}
         if(sup_med.length>=2){$('#row_MED').addClass("disabledbutton")}
       }
       $('#empModal').modal('hide');
       muestrasuplentes();
       $(".suplente_int > .cuadro_contenedor").addClass("disabledbutton");
       divid.removeClass('disabledbutton');

       function change() {
         var divid_sup = divid.closest('.suplente_int');
         var entra=$(this).find('#img_cambiada').attr('data-pos');
         var user_b=$(this).find('#img_cambiada').attr('data-usr');
         var sup_entra=$(this).closest('.cuadro_contenedor');
         divid.find('.jugador_ico').removeClass('cuadro_int_sup');
         divid.find('.jugador_ico').addClass('cuadro_int');
         divid_sup.contents().appendTo('#row_'+userpos_a);
         $(this).removeClass('cuadro_int');
         $(this).addClass('cuadro_int_sup');
         sup_entra.appendTo(divid_sup);

         $.ajax({
         url: '/ajaxchange',
         type: 'post',
         data:  {user_a: user_b, user_b: user, capi:capi},
         success: function(){
         console.log('Jugador Cambiado')
         }
       });
       };
       $('.jugador_ico').on('click', change);
     }

     $('.jugador_ico').on('click', function(){
       
       $(".cuadro_contenedor").removeClass("disabledbutton");
       $('.row_cancha').removeClass("disabledbutton");
       $('#suplente_0').removeClass("disabledbutton");
       $('#suplente_1').removeClass("disabledbutton");
       $('#suplente_2').removeClass("disabledbutton");
       $('#suplente_3').removeClass("disabledbutton");
       $('.cuadro_int_bench_des').hide(800);
       divid_sup=undefined;
       userpos_a=undefined;
       $('.jugador_ico').off('click',change);

     });  
 });
 
 });

//Script para nombrar capitan
$(document).ready(function(){
  $('.botoncapitan').click(function(){
    console.log('debanca' , debanca);
    var user = $(this).attr('data-usr');
    $('#empModal').on('hidden.bs.modal', function() {
      var user = undefined;
    });
    $('#empModal').modal('hide');
      if(debanca==false){
        $('#img_capi').remove();
        divid.prepend("<img src='static/images/capitan.png' alt='capitan' id='img_capi' class='img-fluid rounded'  data-usr='"+user+"'>");
        capi=user;
      }
      else{
        $('#empModal').on('hidden.bs.modal', function() {
          $('.botoncapitan').removeClass("disabledbutton");
        });
      }
    }); 
  });


//Script cuando se hace click en botontransf-->
    $(document).ready(function(){
    $('.botontransf').click( function(){
      guardado=false;
      var user = $(this).attr('data-usr');
      var userpos_a = $(this).attr('data-pos');
      var userprice=$(this).attr('data-price');
      var POS =$(this).attr('data-pt');
      var toptions= '<button class="btn_return" type="button" data-toggle="tooltip" data-user="'+user+'" data-price="'+userprice+'"  data-placement="bottom" title="Recuperar jugador"><span class="material-icons md-20">compare_arrows</button><button type="button" class="btn_transf" data-toggle="tooltip" data-placement="bottom" title="Buscar reemplazo"><span class="material-icons md-20">person_search</button>' 
      $('#empModal').on('hidden.bs.modal', function() {
            var user = undefined;
            var userpos_a = undefined;
            var userprice = undefined;
            

          });
      $('#empModal').modal('hide');
      divid.find('#img_cambiada').addClass('jug_vendido');
      divid.find('#img_cambiada').css('display','none');
      divid.find('b').css('display','none');
      divid.find('.img_reemplazo').css('display','flex');
      divid.find('.jugador_ico').addClass('jugador_ico_transf').removeClass('jugador_ico');
      $('.jugador_ico_transf').addClass('disabledbutton');
      divid.find('.casilla').append(toptions);
      var fila_sale=$('.btn_'+user).closest('tr');
      fila_sale.removeClass('disabledbutton');
      $.ajax({
        url: '/ajaxtransfer',
        type: 'post',
        cache: false,
        data: {operacion: 'carga', POS: POS},
        success: function(response){ 
          equipo = response.equipo;
          $.each(equipo, function(indice, elemento){
            sup=$('table').find('button[data-id^="'+elemento+'"]').closest('tr');
            sup.addClass('disabledbutton');
          });
          pres = parseFloat(pres) + parseFloat(userprice);
          pres=pres.toFixed(1);
          $('#campopresupuesto').text(pres);
          if (pres<0){
                $('#campopresupuesto').css("color", "red")
              }
          if (pres>=0){
            $('#campopresupuesto').css("color", "black")
          }
        }
       });

         //Al introducir letras en el buscador de tabla
         $("#filter").keyup(function(){

          // Retrieve the input field text and reset the count to zero
          var filter = $(this).val(), count = 0;
          
          $("#no-count").text('');
          // Loop through the comment list
          $("table tbody tr").each(function(){

              // If the list item does not contain the text phrase fade it out
              if ($(this).closest('tr').attr('style')!='display: none;'){
              if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                  $(this).addClass('ocultoSearch');

              // Show the list item if the phrase matches and increase the count by 1
              } else {
                
                
                  $(this).show();
                  count++;}
                
              }
          });
          }); 
          //Al borrar letras del buscador en tabla
        $("#filter").keydown(function(){

          
          // Retrieve the input field text and reset the count to zero
          var filter = $(this).val(), count = 0;
          $("#no-count").text('');
          // Loop through the comment list
          $("table tbody tr").each(function(){

              // If the list item does not contain the text phrase fade it out
              if ($(this).closest('tr').attr('style')!='display: none;'){
              if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                  $(this).removeClass('ocultoSearch');
                  console.log('entraif');

              // Show the list item if the phrase matches and increase the count by 1
              } else {
                
                  console.log('entraelse');
                  $(this).show();
                  count++;}
                
              }
          });
          });
          
        

      function recupera(){
        reemp=$(this).closest('.casilla');
        ret_usr = $(this).attr('data-user');
        ret_price = $(this).attr('data-price');
        console.log('entra_ret', ret_usr);
        var recu=reemp.find('.img_reemplazo').attr('id');
        reemp.find('.jugador_ico_transf').removeClass('disabledbutton');
        reemp.find('.jugador_ico_transf').addClass('jugador_ico');
        reemp.find('.jugador_ico_transf').removeClass('jugador_ico_transf');
        reemp.find('.jug_vendido').css('display','unset');
        reemp.find('b').css('display','unset');
        reemp.find('.img_reemplazo').css('display','none');
        reemp.find('.btn_return').remove();
        reemp.find('.btn_transf').remove();
        var fila_sale=$('.btn_'+user).closest('tr');
        fila_sale.addClass('disabledbutton');
        $.ajax({
          url: '/ajaxrecupera',
          type: 'post',
          cache: false,
          data: {operacion: 'carga', POS:recu, usr:ret_usr},
          success: function(response){ 
            equipo = response.equipo;
            precio_eq = response.precio_eq
            $.each(equipo, function(indice, elemento){
              sup=$('table').find('button[data-id^="'+elemento+'"]').closest('tr');
              sup.addClass('disabledbutton');
            });
            pres = parseFloat(pres) - parseFloat(userprice);
            pres=pres.toFixed(1);
            $('#campopresupuesto').text(pres);
            if (pres<0){
                  $('#campopresupuesto').css("color", "red")
                }
          }
         });
      }
      function reemplaza() {
        
        $('#tableModal').modal('show');
        $('#tableModal').on('hidden.bs.modal', function(){
          $('#filter').val('');
        });
        
        im=$(this).closest('.casilla').find('.img_reemplazo');
        posi=im.attr('id');

        imv=$(this).closest('.casilla').find('#img_cambiada');
        last_reemp=imv.attr('data-pos');
        console.log(last_reemp, userpos_a, posi);

        
        $('#filtro_'+last_reemp).prop('checked', true);
        if (last_reemp=='POR'){
        $("#tabla td.col3:contains('POR')").parent().show();
        $("#tabla td.col3:not(:contains('POR'))").parent().hide()};
        if (last_reemp=='DEF'){
        $("#tabla td.col3:contains('DEF')").parent().show();
        $("#tabla td.col3:not(:contains('DEF'))").parent().hide()};

        if (last_reemp=='ATA'){
        $("#tabla td.col3:contains('ATA')").parent().show();
        $("#tabla td.col3:not(:contains('ATA'))").parent().hide()};
        if (last_reemp=='MED'){
        $("#tabla td.col3:contains('MED')").parent().show();
        $("#tabla td.col3:not(:contains('MED'))").parent().hide()};
          

        $.ajax({
              url: '/ajaxtransfer',
              type: 'post',
              cache: false,
              data: {operacion: 'carga', POS: posi},
              success: function(response){ 
                equipo = response.equipo;
                $.each(equipo, function(indice, elemento){
                  sup=$('table').find('button[data-id^="'+elemento+'"]').closest('tr');
                  sup.addClass('disabledbutton');
                });
              }
          });
      }
      
      $('.btn_return').on('click', recupera);
      $('.btn_transf').on('click', reemplaza);

   
      
  
  });
    
});

//Script para mostrar modal con datos de jugador, y pasar datos al botonadd-->
  $(document).ready(function(){
            
    $('.botoninfo').click(function(){
      var userid = $(this).data('id');
      var teamid = $(this).attr("team");
      var nameid = $(this).attr('name');
      var price = $(this).attr('price');
      var timage = $(this).attr('timage')
      $('#tableModal').modal('hide');
      $('.botonadd').attr("data-usr", userid);
      $('.botonadd').attr("data-team", teamid);
      $('.botonadd').attr("data-name", nameid);
      $('.botonadd').attr("data-price", price);
      $('.botonadd').attr("data-timage", timage);
      $('#inModal').on('hidden.bs.modal', function() {
        $('.botonadd').removeAttr("data-usr");
        $('.botonadd').removeAttr("data-team");
        $('.botonadd').removeAttr("data-name");
        $('.botonadd').removeAttr("data-price");
        $('.botonadd').removeAttr("data-timage");
      });
          $.ajax({
              url: '/ajaxfile',
              type: 'post',
              cache: false,
              data: {userid: userid},
              success: function(data){ 
                  $('.modal-body').html(data); 
                  $('.modal-body').append(data.htmlresponse);
                  $('#inModal').modal('show'); 
              }
          });
          $('.btn_list').on('click', function(){
            $('#inModal').modal('hide');
            $('#tableModal').modal('show');
          });   
        });
      });
//Script cuando se hace click en botonadd-->
  $(document).ready(function(){
   $('.botonadd').click(async function(){
    var user = $(this).attr('data-usr');
    var team = $(this).attr('data-team');
    var name = $(this).attr('data-name');
    var price = $(this).attr('data-price');
    var timage = $(this).attr('data-timage');
    var a_vender= $('.jug_vendido').attr('data-team');
    var cantidad
    var cant = $(document).find('img[data-team^="'+team+'"]');
    var saltar_paso = false;
    
    if (a_vender == team) {cantidad = cant.length - 1;}
    else {cantidad = cant.length; }
    $('#empModal').on('hidden.bs.modal', function() {
        var user = undefined;
        var team = undefined;
        var name = undefined;
        var price = undefined;
        var cant = undefined;
        var cantidad = undefined;
        var timage = undefined;
      });
    if(cantidad >= 3){alert('Ta tienes 3 jugadores del club ......')}
    else{
          await $.ajax({
          url: '/ajaxcompra',
          type: 'post',
          data:  {userid: user, capi:capi},
          success: function (response) {
            
            if (response.msg != undefined) {
              alert(response.msg);
              saltar_paso = true;
              return false;
            }
            POS = response.pos;
            
          }
          });
        if(saltar_paso == true) { return false;}
        else {
          $('#'+POS).hide("#img_cambiada");
          var btn_entra = $('#btn_'+POS).closest('button');
          var casilla_entra = btn_entra.closest('.casilla');
          btn_entra.removeClass('disabledbutton');
          btn_entra.removeClass('jugador_ico_transf');
          btn_entra.addClass('jugador_ico');
          casilla_entra.find('.btn_return').remove();
          casilla_entra.find('.btn_transf').remove();
          casilla_entra.find('.jug_vendido').remove();
          casilla_entra.find('b').remove();
          casilla_entra.find('br').remove();
          $('#btn_'+POS).append("<img src="+timage+" alt='Micha' id='img_cambiada' class='img-fluid rounded img_"+POS+"' data-usr='"+user+"' data-price='"+price+"' data-team='"+team+"'><b>"+name+"</b><br><b>"+price+"</b>");
          $('#inModal').on('hidden.bs.modal', function() {
            var POS = undefined;
          });
          $('#inModal').modal('hide');
          var fila_entra=$('.btn_'+user).closest('tr');
          fila_entra.addClass('disabledbutton');
          pres = pres - price
          pres=pres.toFixed(1);
          $('#campopresupuesto').text(pres);
          if (pres<0){
            $('#campopresupuesto').css("color", "red")
          }
        }
    }
   
  });
  
  });


//Script para guardar cambios-->
    $(document).ready(function(){
      $('.btn_guardar').click(function(){
        guardado=true;
        $.ajax({
        url: '/ajaxcompra',
        type: 'post',
        data:  {userid: 'crear',capi:capi,pres:pres},
        success: function (response) {
          if (response.msg != undefined) {
                      alert(response.msg);
                      saltar_paso = true;
                      return false;
                    }
                    if(response.creado==true){
                      verif=1;
                      window.location='/equipo';}
                      location.reload;
        }
    });
      })
    })

//Script para eliminar jugador-->
    $(document).ready(function(){
      $('.btn-close').click(function(){
        var POS = $(this).attr('data-pos');
        var userid = $('.img_'+POS).attr('data-usr');
        var teamid = $('.img_'+POS).attr('data-team');
        var team_price = parseFloat($('#campopresupuesto').text()) ;
        var price = parseFloat($('.img_'+POS).attr('data-price'));
        $('#btn_'+POS).find('b').remove();
        $('#btn_'+POS).find('br').remove();
        $('.img_'+POS).remove();
        $('#'+POS).show("img");
        console.log(userid, team_price, price);

        $.ajax({
            url: '/ajaxrem',
            type: 'post',
            data:  {userpos: POS, price: price, team: teamid},
        });
        $('.btn_'+userid).removeAttr("disabled", "disabled");
        $('.btn_'+userid).addClass("boton-info");
        var pres = team_price + price;
        $('#campopresupuesto').text(pres)
        if (pres>0){ $('#campopresupuesto').css("color", "black") }
      });
    });

 //-Script para mostrar modal para reiniciar equipo-->
    $(document).ready(function(){
      $('.btn_reiniciar').click(function(){
        guardado=true;
        $('#altModal').modal('show');
        $('#altModal').find('.botonelimina').click(function(){
          location.reload();
        });
        });
      });  


//Script para agregar ordenador en tabla. Jquery y tablesorter plugin needed-->
$(function() {
  $("#tabla").tablesorter({ sortList: [[4,1],[5,0]] });
  });



//Script para prevenir salida de pagina luego de interactuar un poco-->
      window.addEventListener("beforeunload", (evento) => {
          if (true) {
              if (guardado==false){
              evento.preventDefault();}
              evento.returnValue = "";
              return "";
          }
      });

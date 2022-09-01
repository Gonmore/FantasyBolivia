
function anchoPage(){

  if (window.innerWidth > 850){
          //$('#smartwizard').css('display','none');
          //Script reglas y Fav-->
          $(function(){
            
            $('#reglasModal').modal('show');
            $(".filtro_pos").prop('checked', false);
            $(".team_checkbox").prop('checked', false);
            $('.btn-empezar').click(function(){
              $('#favModal').modal('show');
            })   
        }); 



    //Script filtro tabla-->
          var fav
          $(document).ready(function(){
            guardado=true;
            $("#filter").keyup(function(){

                // Retrieve the input field text and reset the count to zero
                var filter = $(this).val(), count = 0;
                $("#no-count").text('');
                // Loop through the comment list
                $("table tbody tr").each(function(){

                    // If the list item does not contain the text phrase fade it out
                    if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                        $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                    } else {
                        $(this).show();
                        count++;
                    }
                });

                // Update the count
                var numberItems = count;
                $("#filter-count").text("Coincidencias = "+count);
                if(count < 1) {
                  $("#no-count").text('No result');
                } else {
                  $("#no-count").text('');
                }
                
                });

            $(".filtro_pos").on("change", function () {
              $(".filtro_pos").not(this).prop('checked', false)
              if( $(this).is(':checked') ){
                $("#tabla td.col3:contains('" + $(this).val() + "')").parent().show();
                $("#tabla td.col3:not(:contains('" + $(this).val() + "'))").parent().hide();
              } else { 
                $("#tabla td.col3:not(:contains('" + $(this).val() + "'))").parent().show();
              }
          });
          $(".team_checkbox").on("change", function () {
              $(".team_checkbox").not(this).prop('checked', false);
              fav=$(this).val();  
          });  
        }); 

    //Script para mostrar modal con datos de jugador, y pasar datos al botonadd-->
          $(document).ready(function(){
                    
            $('.botoninfo').click(function(){
              $('.botonadd').removeAttr("disabled", "disabled");
              var userid = $(this).data('id');
              var teamid = $(this).attr("team");
              var nameid = $(this).attr('name');
              var price = $(this).attr('price');
              var timage = $(this).attr('timage');
              $('.botonadd').attr("data-usr", userid);
              $('.botonadd').attr("data-team", teamid);
              $('.botonadd').attr("data-name", nameid);
              $('.botonadd').attr("data-price", price);
              $('.botonadd').attr("data-timage", timage);
              $('#empModal').on('hidden.bs.modal', function() {
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
                          $('#empModal').modal('show'); 
                      }
                  });   
                });
              });
            
            

    //Script cuando se hace click en botonadd-->
          $(document).ready(function(){
          $('.botonadd').click(async function(){
            $('.botonadd').attr("disabled", "disabled");
            guardado=false;
            var user = $(this).attr('data-usr');
            var team = $(this).attr('data-team');
            var name = $(this).attr('data-name');
            var price = $(this).attr('data-price');
            var timage = $(this).attr('data-timage');
            var saltar_paso = false;
            var POS = 
            
            $('#empModal').on('hidden.bs.modal', function() {
                var user = undefined;
                var team = undefined;
                var name = undefined;
                var price = undefined;
                var timage = undefined;
              });
              
              $('#empModal').fadeOut(2000,function() {
                $('#empModal').modal('hide');
              });
              await $.ajax({
              url: '/ajaxadd',
              type: 'post',
              data:  {userid: user},
              success: function (response) {
                
                if (response.msg != undefined) {
                  alert(response.msg);
                  saltar_paso = true;
                  return false;
                }
                POS = response.POS;
                team_price = response.price;
              }
              });
            if(saltar_paso == true) { return false;}
            else {
            
            $('#'+POS).hide("img");
            $('#btn_'+POS).prepend("<img src="+timage+" alt='Micha' id='img_cambiada' class='img-fluid rounded img_"+POS+"' data-usr='"+user+"' data-price='"+price+"' data-team='"+team+"'><b>"+name+"</b><br><b>"+price+"</b>");
            $('#btn_'+POS).addClass("boton-remp");
            cuadro_quita=$('#btn_'+POS).closest('.cuadro_contenedor');
            cuadro_quita.addClass('cuadro_quita');
            cuadro_quita.removeClass('cuadro_contenedor');
            
            $('.btn_'+user).attr("disabled", "disabled");
            $('.btn_'+user).removeClass("boton-info");
            
            var pres = 80 - team_price
            $('#campopresupuesto').text(pres);
            if (pres<0){
              $('#campopresupuesto').css("color", "red")
            }
            }
          
          });
          
          });

              //Script para mostrar modal con datos de jugador, y pasar datos al boton-quitar-->
              $(document).on('click','.cuadro_quita', function(){
                      
                  var imagen=$(this).find('#img_cambiada');
                  var close=$(this).find('.btn-close');
                  var userid = imagen.data('usr');
                  var teamid = imagen.data("team");
                  var price = imagen.data('price');
                  var team_price = parseFloat($('#campopresupuesto').text()) ;
                  var posicion=close.data('pos');
                  $('.botonquitar').attr("data-usr", userid);
                  $('.botonquitar').attr("data-team", teamid);
                  $('.botonquitar').attr("data-price", price);
                  $('.botonquitar').attr("data-pos", posicion);
                  $('#rempModal').on('hidden.bs.modal', function() {
                    $('.botonquitar').removeAttr("data-usr");
                    $('.botonquitar').removeAttr("data-team");
                    $('.botonquitar').removeAttr("data-price");
                    $('.botonquitar').removeAttr("data-pos");
                  });
                      $.ajax({
                          url: '/ajaxfile',
                          type: 'post',
                          cache: false,
                          data: {userid: userid},
                          success: function(data){ 
                              $('.modal-body').html(data); 
                              $('.modal-body').append(data.htmlresponse);
                              $('#rempModal').modal('show'); 
                          }
                      });   
                    });
                  

    //Script para eliminar jugador con modal-->
    $(document).ready(function(){
      $('.botonquitar').click(function(){
        var POS = $(this).attr('data-pos');
        var userid = $(this).attr('data-usr');
        var teamid = $(this).attr('data-team');
        var team_price = parseFloat($('#campopresupuesto').text()) ;
        var price = parseFloat($(this).attr('data-price'));
        $('#btn_'+POS).find('b').remove();
        $('#btn_'+POS).find('br').remove();
        cuadro_q=$('#btn_'+POS).closest('.cuadro_quita');
        cuadro_q.addClass('cuadro_contenedor');
        cuadro_q.removeClass('cuadro_quita');
        $('.img_'+POS).remove();
        $('#'+POS).show("img");

        $.ajax({
            url: '/ajaxrem',
            type: 'post',
            data:  {userpos: POS, price: price, team: teamid},
        });
        $('.btn_'+userid).removeAttr("disabled", "disabled");
        $('.btn_'+userid).addClass("boton-info");
        var pres = team_price + price;
        $('#campopresupuesto').text(pres)
        $('#rempModal').modal('hide');
        if (pres>0){ $('#campopresupuesto').css("color", "black") }
      });
    });


    //Script para mostrar modal para reiniciar equipo-->
          $(document).ready(function(){
            $('.btn_reiniciar').click(function(){
              guardado=true;
              
              $('#altModal').modal('show');
              $('#altModal').find('.botonelimina').click(function(){
                
                location.reload();
              });
              });
            });
        

    //Script para guardar  equipo-->
          var verif = 0;
          $(document).ready(function(){
            $('.btn_creaequipo').click( function(){
              
              var nameteam = $('#nombre_equipo').val();
              
              if (nameteam == ''){
                alert('Ingresa nombre de tú equipo');
                return false;
              }
              console.log('fav:' ,fav)
              if (fav == ''){
                alert('Elige tu equipo favorito');
                $('#favModal').modal('show');
                return false;
              }
              else {
                $.ajax({
                  url: '/ajaxadd',
                  type: 'post',
                  data:  {userid:'crear', nameteam:nameteam, favorito:fav},
                  success: function (response) {
                      if (response.msg != undefined) {
                        alert(response.msg);
                        saltar_paso = true;
                        return false;
                      }
                      if(response.creado==true){
                        guardado=true;
                        verif=1;
                        window.location='/equipo';}
                      location.reload;
                    }
                });
              }
            });
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
          
    //Script para agregar ordenador en tabla. Jquery y tablesorter plugin needed-->

    $(function() {
      $("#tabla").tablesorter({ sortList: [[3,1],[4,0]] });
      });
    }
    
    
    
    else{
    $(document).ready(function(){
    function muestratabla(that){
        guardado=true;
        $('.filtro_pos').prop('checked', false);
        var imv=$(this);
        var last_reemp=$(that).attr('data-pos');
        $('.cajafiltro').css('display','block');
        
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
    }
    $('.casilla').addClass('disabledbutton');
    $(function(){
            
      $('#reglasModal').modal('show');
      $(".filtro_pos").prop('checked', false);
      $(".team_checkbox").prop('checked', false);
      $('.btn-empezar').click(function(){
        $('#favModal').modal('show');
      })   
  }); 
      
      cas=$('#btn_A1').closest('.casilla');
      cas.removeClass('disabledbutton');
      cas.addClass('uso-unico');
      $('.cajafiltro').css('display','none');
      //$('#smartwizard').smartWizard();
      $('#overlay').css('display','block');
      $('.uso-unico').click(function(){
        muestratabla(this);
        $('.uso-unico').removeClass('uso-unico');
        $('#overlay').css('display','none');
        $('.casilla').removeClass('disabledbutton');
      })
      $('.jugador_ico').click(function(){
        muestratabla(this);
      })
    })
        //Script filtro tabla-->
        var fav
        $(document).ready(function(){
          
          $("#filter").keyup(function(){

              // Retrieve the input field text and reset the count to zero
              var filter = $(this).val(), count = 0;
              $("#no-count").text('');
              // Loop through the comment list
              $("table tbody tr").each(function(){

                  // If the list item does not contain the text phrase fade it out
                  if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                      $(this).fadeOut();

                  // Show the list item if the phrase matches and increase the count by 1
                  } else {
                      $(this).show();
                      count++;
                  }
              });

              // Update the count
              var numberItems = count;
              $("#filter-count").text("Coincidencias = "+count);
              if(count < 1) {
                $("#no-count").text('No result');
              } else {
                $("#no-count").text('');
              }
              
              });

          $(".filtro_pos").on("change", function () {
            $(".filtro_pos").not(this).prop('checked', false)
            if( $(this).is(':checked') ){
              $("#tabla td.col3:contains('" + $(this).val() + "')").parent().show();
              $("#tabla td.col3:not(:contains('" + $(this).val() + "'))").parent().hide();
            } else { 
              $("#tabla td.col3:not(:contains('" + $(this).val() + "'))").parent().show();
            }
        });
        $(".team_checkbox").on("change", function () {
            $(".team_checkbox").not(this).prop('checked', false);
            fav=$(this).val();  
        });  
      }); 

  //Script para mostrar modal con datos de jugador, y pasar datos al botonadd-->
        $(document).ready(function(){
                  
          $('.botoninfo').click(function(){
            $('.botonadd').removeAttr("disabled", "disabled");
            var userid = $(this).data('id');
            var teamid = $(this).attr("team");
            var nameid = $(this).attr('name');
            var price = $(this).attr('price');
            var timage = $(this).attr('timage');
            $('.botonadd').attr("data-usr", userid);
            $('.botonadd').attr("data-team", teamid);
            $('.botonadd').attr("data-name", nameid);
            $('.botonadd').attr("data-price", price);
            $('.botonadd').attr("data-timage", timage);
            $('#empModal').on('hidden.bs.modal', function() {
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
                        $('#empModal').modal('show'); 
                    }
                });   
              });
            });

  //Script cuando se hace click en botonadd-->
      $(document).ready(function(){
        $('.botonadd').click(async function(){
          $('.botonadd').attr("disabled", "disabled");
          guardado=false;
          var user = $(this).attr('data-usr');
          var team = $(this).attr('data-team');
          var name = $(this).attr('data-name');
          var price = $(this).attr('data-price');
          var timage = $(this).attr('data-timage');
          var saltar_paso = false;
          var POS = 
          
          $('#empModal').on('hidden.bs.modal', function() {
              var user = undefined;
              var team = undefined;
              var name = undefined;
              var price = undefined;
              var timage = undefined;
            });
            $('#empModal').fadeOut(2000,function() {
              $('#empModal').modal('hide');
            });
            $('.cajafiltro').css('display','none');
            await $.ajax({
            url: '/ajaxadd',
            type: 'post',
            data:  {userid: user},
            success: function (response) {
              
              if (response.msg != undefined) {
                alert(response.msg);
                saltar_paso = true;
                return false;
              }
              POS = response.POS;
              team_price = response.price;
            }
            });
          if(saltar_paso == true) { return false;}
          else {
          
          $('#'+POS).hide("img");
          $('#btn_'+POS).prepend("<img src="+timage+" alt='Micha' id='img_cambiada' class='img-fluid rounded img_"+POS+"' data-usr='"+user+"' data-price='"+price+"' data-team='"+team+"'><b>"+name+"</b><br><b>"+price+"</b>");
          $('#btn_'+POS).addClass("boton-remp");
          cuadro_quita=$('#btn_'+POS).closest('.cuadro_contenedor');
          cuadro_quita.addClass('cuadro_quita');
          cuadro_quita.removeClass('cuadro_contenedor');
          
          $('.btn_'+user).attr("disabled", "disabled");
          $('.btn_'+user).removeClass("boton-info");
          
          var pres = 80 - team_price
          $('#campopresupuesto').text(pres);
          if (pres<0){
            $('#campopresupuesto').css("color", "red")
          }
          }
          
        });
        
        });
  
   //Script para mostrar modal con datos de jugador, y pasar datos al boton-quitar-->
   $(document).on('click','.cuadro_quita', function(){
      var imagen=$(this).find('#img_cambiada');
      var close=$(this).find('.btn-close');
      var userid = imagen.data('usr');
      var teamid = imagen.data("team");
      var price = imagen.data('price');
      var team_price = parseFloat($('#campopresupuesto').text()) ;
      var posicion=close.data('pos');
      $('.botonquitar').attr("data-usr", userid);
      $('.botonquitar').attr("data-team", teamid);
      $('.botonquitar').attr("data-price", price);
      $('.botonquitar').attr("data-pos", posicion);
      $('#rempModal').on('hidden.bs.modal', function() {
        $('.botonquitar').removeAttr("data-usr");
        $('.botonquitar').removeAttr("data-team");
        $('.botonquitar').removeAttr("data-price");
        $('.botonquitar').removeAttr("data-pos");
      });
          $.ajax({
              url: '/ajaxfile',
              type: 'post',
              cache: false,
              data: {userid: userid},
              success: function(data){ 
                  $('.modal-body').html(data); 
                  $('.modal-body').append(data.htmlresponse);
                  $('#rempModal').modal('show'); 
              }
          });   
        });
      

   //Script para eliminar jugador con modal-->
        $(document).ready(function(){
          $('.botonquitar').click(function(){
            var POS = $(this).attr('data-pos');
            var userid = $(this).attr('data-usr');
            var teamid = $(this).attr('data-team');
            var team_price = parseFloat($('#campopresupuesto').text()) ;
            var price = parseFloat($(this).attr('data-price'));
            $('#btn_'+POS).find('b').remove();
            $('#btn_'+POS).find('br').remove();
            cuadro_q=$('#btn_'+POS).closest('.cuadro_quita');
            cuadro_q.addClass('cuadro_contenedor');
            cuadro_q.removeClass('cuadro_quita');
            $('.img_'+POS).remove();
            $('#'+POS).show("img");

            $.ajax({
                url: '/ajaxrem',
                type: 'post',
                data:  {userpos: POS, price: price, team: teamid},
            });
            $('.btn_'+userid).removeAttr("disabled", "disabled");
            $('.btn_'+userid).addClass("boton-info");
            var pres = team_price + price;
            $('#campopresupuesto').text(pres)
            $('#rempModal').modal('hide');
            if (pres>0){ $('#campopresupuesto').css("color", "black") }
          });
        });

  //Script para mostrar modal para reiniciar equipo-->
        $(document).ready(function(){
          $('.btn_reiniciar').click(function(){
            guardado=true;
            
            $('#altModal').modal('show');
            $('#altModal').find('.botonelimina').click(function(){
              
              location.reload();
            });
            });
          });
      

  //Script para guardar  equipo-->
        $(document).ready(function(){
          $('.btn_creaequipo').click( function(){
            var nameteam = $('#nombre_equipo').val();
            
            if (nameteam == ''){
              alert('Ingresa nombre de tú equipo');
              return false;
            }
            if (fav == ''){
              alert('Elige tu equipo favorito');
              $('#favModal').modal('show');
              return false;
            }
            else {
              $.ajax({
                url: '/ajaxadd',
                type: 'post',
                data:  {userid:'crear', nameteam:nameteam, favorito:fav},
                success: function (response) {
                    if (response.msg != undefined) {
                      alert(response.msg);
                      saltar_paso = true;
                      return false;
                    }
                    if(response.creado==true){
                      guardado=true;
                      window.location='/equipo';}
                    location.reload;
                  }
              });
            }
          });
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
        
  //Script para agregar ordenador en tabla. Jquery y tablesorter plugin needed-->

  $(function() {
    $("#tabla").tablesorter({ sortList: [[4,1],[5,0]] });
    });

  }
}

anchoPage();



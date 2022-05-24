//Script filtro tabla-->
          $(document).ready(function(){
            $("input:checkbox").on("change", function () {
              $("input:checkbox").not(this).prop('checked', false)
              if( $(this).is(':checked') ){
                $("#tabla td.col3:contains('" + $(this).val() + "')").parent().show();
                $("#tabla td.col3:not(:contains('" + $(this).val() + "'))").parent().hide();
              } else { 
                $("#tabla td.col3:not(:contains('" + $(this).val() + "'))").parent().show();
              }
          });   
        }); 

//Script Formacion-->
          var form;
          var titu;
          var supl;
          $(document).ready(function(){
              $.ajax({
                    url: '/ajaxequipo',
                    type: 'get',
                    success: function(response){ 
                      supl = response.supl;
                      
                      $.each(supl, function(indice, elemento){
                        sup=$('.row_cancha').find('img[data-usr^="'+elemento+'"]').closest('.cuadro_contenedor');
                        sup_btn=$('.row_cancha').find('img[data-usr^="'+elemento+'"]').closest('.jugador_ico');
                        sup_btn.removeClass('cuadro_int');
                        sup_btn.addClass('cuadro_int_sup');
                        sup.appendTo('#suplente_'+indice);
                      });

                        
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

//Script para mostrar modal con datos de jugador, y pasar datos al botonsus-->
        var divid;
        var comodin = false;
        var debanca = false; 
        $(document).ready(function(){
          
          $('.jugador_ico').click(function(){
            debanca = false; 
            if($(this).hasClass('cuadro_int_sup')){debanca = true;};
            if (comodin == true){
              comodin = false;
              return false}
            $('.cuadro_int_bench_des').hide();
            var userid = $(this).find('#img_cambiada').data('usr');
            var userpos = $(this).find('#img_cambiada').data('pos');
            divid = $(this).closest('.cuadro_contenedor');
            $('.botonsus').attr("data-usr", userid);
            $('.botonsus').attr("data-pos", userpos);
            
            $('#empModal').on('hidden.bs.modal', function() {
              $('.botonsus').removeAttr("data-usr");
              $('.botonsus').removeAttr("data-pos");
              
              
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
            console.log('debanca' , debanca);
            var user = $(this).attr('data-usr');
            var userpos_a = $(this).attr('data-pos');       
            var sup_por = $('.cuadro_int_bench_des').find('img[data-pos^="P"]').closest('.suplente_int');
            var sup_def = $('.cuadro_int_bench_des').find('img[data-pos^="D"]').closest('.suplente_int');
            var sup_med = $('.cuadro_int_bench_des').find('img[data-pos^="M"]').closest('.suplente_int');
            var sup_ata = $('.cuadro_int_bench_des').find('img[data-pos^="A"]').closest('.suplente_int');
            console.log(sup_ata.length)
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

                $.ajax({
                url: '/ajaxchange',
                type: 'post',
                data:  {user_a: user, user_b: user_b},
                success: function(){
                console.log('Player Change')
                }
              });

              } 
              $('.jugador_ico').on('click', change);
              
            }
            else{
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
                data:  {user_a: user_b, user_b: user},
                success: function(){
                console.log('Player Change')
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
              console.log('paso');
              $('.jugador_ico').off('click',change);

            });  
        });
        
        });

//Script para guardar cambios-->
        $(document).ready(function(){
          $('.btn_guardar').click(function(){
            $.ajax({
            url: '/ajaxchange',
            type: 'post',
            data:  {user_a: 'guardar'},
            success: function (response) {
              alert(response.msg);
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

//Script para mostrar modal para reiniciar equipo-->
        $(document).ready(function(){
          $('.btn_reiniciar').click(function(){
            
            $('#altModal').modal('show');
            $('#altModal').find('.botonelimina').click(function(){
              
              location.reload();
            });
            });
          }); 

//Script para crear equipo
        $(document).ready(function(){
          $('.btn_creaequipo').click( function(){
            var nameteam = $('#nombre_equipo').val();
            
            if (nameteam == ''){alert('Ingresa nombre de equipo')};

              $.ajax({
                url: '/ajaxadd',
                type: 'post',
                data:  {userid:'crear', nameteam:nameteam},
                success: function (response) {
                    if (response.msg != undefined) {
                      alert(response.msg);
                      saltar_paso = true;
                      return false;
                    }
                    location.reload;
                  }
              });
          });
        });

//Script para agregar ordenador en tabla. Jquery y tablesorter plugin needed-->
        $(function() {
        $("#tabla").tablesorter();
        });

//Script para mostrar boton change
  $(document).ready(function() {
    $('.cuadro_contenedor').hover(function(e) {
      $(this).find('.btn-change').show();  
    },
    function() {
      $(this).find('.btn-change').hide();
    }
    );
    $('.suplente_int').hover(function(e) {
      $(this).find('.btn-change').show();  
    },
    function() {
      $(this).find('.btn-change').hide();
    }
    );
    
});

//Script para prevenir salida de pagina luego de interactuar un poco-->
        window.addEventListener("beforeunload", (evento) => {
            if (true) {
                evento.preventDefault();
                evento.returnValue = "";
                return "";
            }
        });

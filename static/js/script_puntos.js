//Script Formacion-->
          var form;
          var titu;
          var suplentes;
          var capi;
          $(document).ready(function(){
            var suple= $('#supl_equipo').data('supl');
            var suplentes= suple.replace("[","").replace("]","").split(',');
            var capitan= $('#supl_equipo').data('capi');
              $.ajax({
                    url: '/ajaxequipo',
                    type: 'post',
                    data: {ses:ses},
                    success: function(response){ 
                      supl = response.supl;
                      img_cap=$(document).find("img[data-usr='"+capitan+"']");
                      cuadro_cap=img_cap.closest('.cuadro_contenedor');
                      cuadro_cap.prepend("<img src='/static/images/capitan.png' alt='capitan' id='img_capi' class='img-fluid rounded'  data-usr='"+capitan+"'>");
                      
                      pts_capi=cuadro_cap.find('.pts-jug');
                      puntos_capi=parseInt(pts_capi.text())*(2);

                      pts_capi.text(puntos_capi);
                      $.each(suplentes, function(indice, elemento){
                        sup=$('.row_cancha').find('img[data-usr^='+elemento+']').closest('.cuadro_contenedor');
                        sup_btn=$('.row_cancha').find('img[data-usr^='+elemento+']').closest('.jugador_ico');
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
            var jor = $('.btn-next').data("jor");
            console.log(jor)
                $.ajax({
                    url: "/ajaxfile_pts",
                    type: 'post',
                    cache: false,
                    data: {userid:userid , jor:jor},
                    success: function(data){ 
                        $('.modal-body').html(data); 
                        $('.modal-body').append(data.htmlresponse);
                        $('#empModal').modal('show'); 
                    }
                });   
              });
            });



//Script para redireccionar a liga
  $(document).ready(function(){
    $('.btn_liga').click(function(){
      var liga = $(this).data("liga");
      window.location.href="/liga/"+liga;
    })
  })

  //Script para ver puntos de otras jornadas
  $(document).ready(function(){
    $('.btn-next').click(function(){
      var jor = $(this).data("jor");
      jor=jor+1
      if (jor>ron){
        alert('La jornada '+jor+' aun no se jugo!');
        return false;
      }
      window.location.href="/pu/"+ses+"/"+jor;
      
    })
    $('.btn-prev').click(function(){
      var jor = $(this).data("jor");
      jor=jor-1
      if (jor==0){
        alert('No existen jornadas anteriores');
        return false;

      }
      window.location.href="/pu/"+ses+"/"+jor;
    })
  })
//Script Formacion-->
          var form;
          var titu;
          var suplentes;
          $(document).ready(function(){
            var suple= $('#supl_equipo').data('supl');
            var suplentes= suple.replace("[","").replace("]","").split(',');
              $.ajax({
                    url: '/ajaxequipo',
                    type: 'get',
                    success: function(response){ 
                      supl = response.supl;
                      console.log(suple);
                      console.log('suplentes: ', suplentes);
                      console.log('supl: ', supl);
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



//Script para mostrar opcion change
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


//Script para redireccionar a liga
  $(document).ready(function(){
    $('.btn_liga').click(function(){
      var liga = $(this).data("liga");
      window.location.href="/liga/"+liga;
    })
  })




//Script para mostrar modal con datos de jugador, y pasar datos al botonsus-->
        var divid;
        var comodin = false;
        var debanca = false; 
        $(document).ready(function(){
          
          $('.jugador_ico').click(function(){
            var userid = $(this).find('#img_cambiada').data('usr');
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
                        $("tr td:first-child").each(function(index){
                          if($(this).text() === "0") {
                          $(this).closest("th").hide();
                          $(this).hide;
                        }
                        }); 
                    }
                });   
              });
            });




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
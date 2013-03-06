var navigatorController =  {
	openMain : function (){
		 var webworksreadyFired = false;
            document.addEventListener('webworksready', function(e) { 
               if (webworksreadyFired) return;
                webworksreadyFired = true;
                bb.init({actionBarDark: true,
                        controlsDark: false,
                        listsDark: false,
                        bb10ForPlayBook: false,
                        highlightColor: '#C82C29',
                        onscreenready : function(element,id,params){
                        	if(id == "ListaScreen")
                        	{
                        		Db.getListas();
                        	}
                        	if(id == "TarefasScreen")
                        	{
                        		 Db.getTarefas(params.listaid);
                        	}
                        	if(id == 'NewTarefaScreen')
                        	{
                        		
                        	}
                        },
                        ondomready : function(element,id,params){
                        	
                        }

                        });
                bb.pushScreen('Main.html', 'MainScreen');
				Db.open();
            }, false);
	},
	openSobre : function (){
		bb.pushScreen('Sobre.html','SobreScreen');
	},
	openConfig : function (){
		bb.pushScreen('Config.html','ConfigScreen');
	},
	openListas : function (){
		bb.pushScreen('Listas.html','ListaScreen');
	},
	newLista : function (){

			bb.pushScreen('NovaLista.html','NewListScreen');
	},
	saveNewLista : function (){
			Db.addNewLista($('#listaInputName').val());

	},
	newTarefa : function (){
			bb.pushScreen('NovaTarefa.html','NewTarefaScreen',{mode:true});
	},
	saveNewTarefa : function (){
			Db.addNewTarefa($('#tarefaInputName').val());
	}
}
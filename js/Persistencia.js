/* Copyright 2013 Igor Costa

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this db except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.


Simple class for WebStorage persistence, not big deal. Just for to-do-list demo
*/
var Db = {
	currentList:'',
	db : window.openDatabase('todo-app-simples','0.1','Banco de dados simples para um App de to-do-list',2*1024*1024),
	listaSQL : 'CREATE TABLE IF NOT EXISTS listas (id  INTEGER,lista_nome TEXT NOT NULL, cor_lista TEXT NOT NULL DEFAULT "#f2f2f2",data_criada TEXT NOT NULL, PRIMARY KEY (id))',
	tarefasSQL: 'CREATE TABLE IF NOT EXISTS tarefas(id INTEGER,tarefa_nome  TEXT,completa  REAL,data_criada  TEXT,lista_id  INTEGER NOT NULL,PRIMARY KEY (id),FOREIGN KEY (lista_id) REFERENCES listas (id))',
	open : function () {
			try{
				if (window.openDatabase) {
					if(this.db != null){
						this.db.transaction(
				        function (transaction) {
				        	var demoData = new Date();
				        	// preload de 1 lista e 1 tarefa
				        	transaction.executeSql(Db.listaSQL, [], this.onSucess, this.errorHandler);
				        	transaction.executeSql(Db.tarefasSQL, [], this.onSucess, this.errorHandler);
				        	//To insert new records in the first demo, uncomment this than comment again.
				        	//transaction.executeSql('INSERT INTO listas (id,lista_nome,cor_lista,data_criada) VALUES (1,"Lista Demo","#aa0000","'+demoData+'")',[],Db.onSucess, Db.errorHandler);
				        	//transaction.executeSql('INSERT INTO tarefas (tarefa_nome,completa,data_criada,lista_id) VALUES ("Primeira tarefa demo","true","'+demoData+'",1)',[],Db.onSucess, Db.errorHandler);
				        	//transaction.executeSql('INSERT INTO tarefas (tarefa_nome,completa,data_criada,lista_id) VALUES ("Segunda tarefa demo","true","'+demoData+'",1)',[],Db.onSucess, Db.errorHandler);
				        	//transaction.executeSql('INSERT INTO tarefas (tarefa_nome,completa,data_criada,lista_id) VALUES ("Terceira tarefa demo","true","'+demoData+'",1)',[],Db.onSucess, Db.errorHandler);
				        });
				    }	
				}else{
					var msgSupport = "Doesn't support WebStorage";
					alert(msgSupport);
					console.log(msgSupport);
				}

			}catch(e){
					printMsg();
			}
	},
	close : function (){

	},
	executeSQL : function (sql){

	},
	editRecord : function (object){

	},
	deleteTarefa : function (id){
		try{

			this.db.transaction(
				        function (transaction) {
				        	
				        	transaction.executeSql('DELETE FROM tarefas WHERE id=?',[id], Db.onDeleteTarefaSucess, Db.errorHandler);
				        });	


		}catch(e){
			printMsg();
		}
	},
	onDeleteTarefaSucess : function (e,result){
			document.getElementById('myTarefasList').refresh();
			Db.getTarefas(Db.currentList);
			Db.toast('Tarefa Apagada');

	},
	addNewLista : function (name){
		try{
			
			this.db.transaction(
				        function (transaction) {
				        var demoData = new Date();	
				        	transaction.executeSql('INSERT INTO listas (lista_nome,cor_lista,data_criada) VALUES (?,"#aa0000","'+demoData+'")',[name],Db.onSucess, Db.errorHandler);
				        });	

			bb.pushScreen('Listas.html','ListaScreen');
		}catch(e){
			printMsg();
		}			
	},
	getListas : function (){
		try{
			this.db.transaction(
				        function (transaction) {
				        	transaction.executeSql('SELECT * from listas',[],Db.onListaSucess, Db.errorHandler);
				        });	

		}catch(e){
			printMsg();
		}
	},
	onListaSucess : function (e,result){
				var response = [];
				var len = result.rows.length, i;
				var render;
				  for (i = 0; i < len; i++) {
				   var item = result.rows.item(i);
				   
				         render =  document.createElement('div');
					     render.setAttribute('data-bb-type','item');
					     render.setAttribute('data-bb-title',item.lista_nome);
					     render.setAttribute('data-itemid',item.id);
					     render.innerHTML = "Total de tarefas " +item.total;
					     render.setAttribute('data-bb-img','imgs/tag.png');
					     render.addEventListener('click',function(){
					     	bb.pushScreen('Tarefas.html','TarefasScreen',{listaid:$(this).data('itemid')});
					     });
					     response.push(render);
					
				  }document.getElementById('myLists').refresh(response);// voodoo!
	}
	,
	addNewTarefa : function (name){
		try{
			
			this.db.transaction(
				        function (transaction) {
				        var demoData = new Date();	
				        	transaction.executeSql('INSERT INTO tarefas (tarefa_nome,data_criada,lista_id) VALUES (?,"'+demoData+'",'+Db.currentList+')',[name],Db.onSucess, Db.errorHandler);
				        });	
			
			bb.pushScreen('Tarefas.html','TarefasScreen',{listaid:Db.currentList});
		}catch(e){
			printMsg();
		}			
	},
	getTarefas : function (id){
		try{
			Db.currentList = id;
			this.db.transaction(
				        function (transaction) {	
				        	transaction.executeSql('SELECT * FROM tarefas WHERE lista_id = ?',[id],Db.onTarefaSucess, Db.errorHandler);
				        });	


		}catch(e){
			printMsg();
		}
	},
	onTarefaSucess : function (e,result){
		var response = [];
				var len = result.rows.length, i;
				var render;
				  for (i = 0; i < len; i++) {
				   var item = result.rows.item(i);
				         render =  document.createElement('div');
					     render.setAttribute('data-bb-type','item');
					     render.setAttribute('data-bb-title',item.tarefa_nome);
					     render.setAttribute('data-itemId',item.id);
					     render.innerHTML = "Total de tarefas " +item.data_criada;
					     render.setAttribute('data-bb-img','imgs/bookmark.png');
					     $(render).swipeRight(function (){Db.deleteTarefa(item.id);});
					     response.push(render);
					
				  }document.getElementById('myTarefasList').refresh(response);// voodoo!
	},
	errorHandler: function (transaction, error){
		console.log(error);
		 	if (error.code==1){
		 	} else {
			    console.log('Oops.  Error was  '+error.message+' (Code '+error.code+')');
		 	}
		    return false;
	},
	onSucess: function(e,result){
	 return result;
	},
	printMsg : function (){
			var msg = "Can't open Database" + ' Error: ' + e.error;
			alert(msg);
			console.log(msg);
	},
	toast : function (msg, timeout){
		 
		  if(typeof timeout == 'undefined') {
		    timeout = 1000;
		  }

		  // toast options
		  options = {
		    timeout: timeout
		  };

		  // display the toast message
		  toastId = blackberry.ui.toast.show(msg, options);
	}
}
// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// get build artifacts from compiled smart contract and create the truffle contract
import votingArtifacts from "../../build/contracts/Creator.json"
var VotingContract = contract(votingArtifacts)

/*
 * This holds all the functions for the app
 */
window.App = {
  // called when web3 is set up
  start: function() {
	for (var i = 0; i < 10; i++) { 
		$("#mySelect").append("<option >"+window.web3.eth.accounts[i]+"</option>");		    
						
	}
    // setting up contract providers and transaction defaults for ALL contract instances
    VotingContract.setProvider(window.web3.currentProvider)
    VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})
	
    // creates an VotingContract instance that represents default address managed by VotingContract
   
  },

  getPolls: function(i){
 		VotingContract.deployed().then(function(instance){
	      instance.get_title(i).then(function(name){
		
		$("#create-box").append(name + " <button class='btn btn-primary' onclick='App.show("+i+")'>Pokaż</button> <br>");
				
	      })
	    }).catch(function(err){
	      console.error("ERROR! " + err.message)
	    })

},
  create: function(){
		
	$("#create-box").empty();
	$("#create-box").append("<input type='text' class='form-control' id='contract-title'   placeholder='Zadaj pytanie'> <br>");
	$("#create-box").append("<form id='input-form'></form>");
 	$("#input-form").append("<input type='text' class='form-control' id='id-input'   placeholder='Dodaj odpowiedź'>");
	$("#input-form").append("<input type='text' class='form-control' id='id-input'  placeholder='Dodaj odpowiedź'>");
	
	$("#input-form").children('input').each(function(k){
        var obj = $(this); 
        console.log(obj.val());
   	})

	$("#create-box").append( " <button class='btn btn-primary' onclick='App.addAnswer()'>+</button> ");
	$("#create-box").append( "  <button  class='btn btn-primary' onclick='App.createContract()'>Utwórz</button> ");
  },

  addAnswer: function(){
	$("#input-form").append("<input type='text' class='form-control' id='id-input'  placeholder='Dodaj odpowiedź'>");
  },
  createContract: function(){
	
	var name=$("#contract-title").val();
	var id;
	 VotingContract.deployed().then(function(instance){

			     
			      instance.create(name, {value:10,from: document.getElementById("mySelect").value}).then(function(numOfCandidates){
				console.log(numOfCandidates.logs[0].args.numCreate.c[0])
			     	id=(numOfCandidates.logs[0].args.numCreate.c[0])
				App.addCandidates(id);			
				$("#create-box").empty();
				App.show(id);	
			      })
			    }).catch(function(err){
			      console.error("ERROR! " + err.message)
			    })

	
  },	
   addCandidates: function(number){
	$("#input-form").children('input').each(function(k){
        var obj = $(this); 
		VotingContract.deployed().then(function(instance){

			     
				      instance.addCanditeds(number,obj.val(),"").then(function(){
						
						
				      })
			    }).catch(function(err){
			      console.error("ERROR! " + err.message)
			    })

        console.log(obj.val() +" "+ number );
    })

},

   show: function(contractID){
	$("#create-box").empty();

	VotingContract.deployed().then(function(instance){

     
      	instance.get_title(contractID).then(function(name){
        	$("#create-box").append(name+"<br>  <ul id='list'> </ul> <select class='btn btn-primary' id='voteSelect'> </select>  ")
     		$("#voteSelect").append("   <option disabled selected value> - wybierz opcje - </option>")
		$("#create-box").append( " <button class='btn btn-primary' onclick='App.vote("+contractID+")'>Głosuj</button> ");
      	})

		instance.get_total_can(contractID).then(function(amount){
        	//$("#create-box").append(amount.c[0])
		var tmp=0;
	     	console.log(amount.c[0]+" "+ contractID);
			for (var i = 0; i < amount.c[0]; i++) { 
				instance.get_can(contractID,i).then(function(answer){
					
					$("#list").append("<li>"+answer[1]+"</li>")
					$("#voteSelect").append("<option>"+tmp+". "+answer[1]+"</option>");
			     		tmp++;
			      	})		    
						
			}
      		})

    }).catch(function(err){
      console.error("ERROR! " + err.message)
    })

 	
  },	

  list: function(){
		
	$("#create-box").empty();
	VotingContract.deployed().then(function(instance){
	      instance.get_num_cont().then(function(number){
		console.log(number.c[0]);

				for (var i = 0; i < number.c[0]; i++) { 
					    App.getPolls(i);
						
				}
	      })
	    }).catch(function(err){
	      console.error("ERROR! " + err.message)
	    })

	
  },
  
  vote: function(contractID) {
   		var candidatName= document.getElementById("voteSelect").value;
    		var candidatID = candidatName.substring(0, 1);

		VotingContract.deployed().then(function(instance){

			     
		instance.c_vote(contractID,"",candidatID,{value:1, from: document.getElementById("mySelect").value}).then(function(){
						
						alert("Dziękujemy za udział w głosowaniu!")
				      }).catch(function(err){
					      alert("Już głosowałeś w tej ankiecie!")
					    })
			    }).catch(function(err){
			      	
			    })
  },

  // function called when the "Count Votes" button is clicked
  findNumOfVotes: function() {
    VotingContract.deployed().then(function(instance){
      // this is where we will add the candidate vote Info before replacing whatever is in #vote-box
      var box = $("<section></section>")

      // loop through the number of candidates and display their votes
      for (var i = 0; i < num; i++){
        // calls two smart contract functions
        var candidatePromise = instance.getCandidate(i)
        var votesPromise = instance.totalVotes(i)

        // resolves Promises by adding them to the variable box
        Promise.all([candidatePromise,votesPromise]).then(function(data){
          box.append(`<p>${window.web3.toAscii(data[0][1])}: ${data[1]}</p>`)
        }).catch(function(err){
          console.error("ERROR! " + err.message)
        })
      }
      $("#vote-box").html(box) // displays the "box" and replaces everything that was in it before
    })
  }
}

// When the page loads, we create a web3 instance and set a provider. We then set up the app
window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  // if (typeof web3 !== "undefined") {
  //   console.warn("Using web3 detected from external source like Metamask")
  //   // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
  //   window.web3 = new Web3(web3.currentProvider)
  // } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))
  // }
  // initializing the App
  window.App.start()
})

pragma solidity ^0.4.18;

contract Voting {
    
    event AddedCandidate(uint candidateID);

   
    struct Voter {
        bytes32 uid; // bytes32 type are basically strings
        uint candidateIDVote;
    }
   
    struct Candidate {
        bytes32 name;
        bytes32 party; 
        bool doesExist; 
    }

     
    uint numCandidates; 
    uint numVoters;

    
    
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;
    
   

    function addCandidate(bytes32 name, bytes32 party) public {
        // candidateID is the return variable
        uint candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name,party,true);
        AddedCandidate(candidateID);
    }

    function vote(bytes32 uid, uint candidateID) public {
        // checks if the struct exists for that candidate
        if (candidates[candidateID].doesExist == true) {
            uint voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid,candidateID);
        }
    }

   
    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0; // we will return this
        for (uint i = 0; i < numVoters; i++) {
            // if the voter votes for this specific candidate, we increment the number
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes; 
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }

    function getCandidate(uint candidateID) public view returns (uint,bytes32, bytes32) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
    }
}

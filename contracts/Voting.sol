pragma solidity ^0.4.18;

contract Voting {
    
    // event AddedCandidate(uint candidateID);


    struct Voter {
        string uid; // bytes32 type are basically strings
        uint deposit;
        bool voted;
    }

    struct Candidate {
        string name;
        string tags;
        uint totalvote;
    }


    uint public numCandidates;



    mapping (uint => Candidate) candidates;
    mapping (address => Voter) voters;



    function addCandidate(string name, string party) external {
        // candidateID is the return variable

        // Create new Candidate Struct with name and saves it to storage.
        candidates[numCandidates] = Candidate(name,party, 0);
        numCandidates++;
        // emit AddedCandidate(candidateID);
    }

    function vote(string uid, uint candidateID, address a) external payable{
        // checks if the struct exists for that candidate
        require(msg.value == 1);
        voters[a] = Voter(uid,msg.value,true);
        candidates[candidateID].totalvote ++;



    }
    function hasVoted(address a) view external returns (bool){
        return voters[a].voted;
    }


    function totalVotes(uint candidateID) view external returns (uint) {

        return candidates[candidateID].totalvote;
    }


    function getCandidate(uint candidateID) external view returns (uint,string, string) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].tags);
    }
}

contract Creator {
    struct Voting_map {
        Voting v;
        string title;
    }
    mapping (uint => Voting_map) voting;
    mapping (uint => address) is_alive;
    uint numCreate;

    function create(string title) public payable returns (uint) {
            require(msg.value == 10);
            voting[numCreate].v = new Voting();
            voting[numCreate].title = title;
            is_alive[numCreate] = msg.sender;
            numCreate ++;
            return numCreate-1;



    }
    function addCanditeds(uint to_vote, string name, string party) public{
        if(is_alive[to_vote] == msg.sender){
            voting[to_vote].v.addCandidate(name, party);
        }
    }
    function c_vote(uint to_vote, string uid, uint candidateID) public payable {
        if(!voting[to_vote].v.hasVoted(msg.sender)){
            require(msg.value == 1);
            voting[to_vote].v.vote.value(msg.value)(uid, candidateID, msg.sender);

        }
    }
    function total_votes(uint to_vote, uint candidateID) view public returns (uint) {

        return voting[to_vote].v.totalVotes(candidateID);
    }
    function get_can(uint to_vote, uint candidateID) public view returns (uint,string, string) {
        return voting[to_vote].v.getCandidate(candidateID);
    }
    function get_total_can(uint to_vote) public view returns (uint) {
        return voting[to_vote].v.numCandidates();
    }
    function get_num_cont() public view returns (uint){
        return numCreate;
    }


}

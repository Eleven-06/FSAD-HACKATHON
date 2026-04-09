package com.example.voting.controllers;

import com.example.voting.models.Candidate;
import com.example.voting.models.Voter;
import com.example.voting.repositories.CandidateRepository;
import com.example.voting.repositories.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
// Updated this line to allow both ports!
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) 
public class VotingController {

    @Autowired
    private CandidateRepository candidateRepo;

    @Autowired
    private VoterRepository voterRepo;

    @GetMapping("/candidates")
    public List<Candidate> getCandidates(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return candidateRepo.findByNameContainingIgnoreCase(search);
        }
        return candidateRepo.findAll();
    }

    @PostMapping("/vote")
    public ResponseEntity<?> castVote(@RequestBody Map<String, String> payload) {
        String voterId = payload.get("voterId");
        Long candidateId = Long.parseLong(payload.get("candidateId"));

        Optional<Voter> voterOpt = voterRepo.findById(voterId);
        if (voterOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Voter not found."));

        Voter voter = voterOpt.get();
        if (voter.isHasVoted()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You have already voted!"));

        Optional<Candidate> candidateOpt = candidateRepo.findById(candidateId);
        if (candidateOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Candidate not found."));

        voter.setHasVoted(true);
        voterRepo.save(voter);

        Candidate candidate = candidateOpt.get();
        candidate.setVoteCount(candidate.getVoteCount() + 1);
        candidateRepo.save(candidate);

        return ResponseEntity.ok(Map.of("message", "Vote cast successfully!"));
    }

    @GetMapping("/results")
    public List<Candidate> getResults() {
        return candidateRepo.findAll(Sort.by(Sort.Direction.DESC, "voteCount"));
    }

    @GetMapping("/voters")
    public Page<Voter> getVoters(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return voterRepo.findAll(PageRequest.of(page, size, Sort.by("name")));
    }
}
package com.example.bookstore.controller;

import com.example.Bookstore.model.Livro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.example.Bookstore.repository.LivroRepository;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "http://localhost:8082")
public class LivroController {

    @Autowired
    private LivroRepository livroRepository;

    @GetMapping
    public List<Livro> getAllLivros() {
        return livroRepository.findAll();
    }

    @PostMapping
    public Livro createLivro(@RequestBody Livro livro) {
        return livroRepository.save(livro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> updateLivro(@PathVariable Long id, @RequestBody Livro livroDetails) {
        Optional<Livro> optionalLivro = livroRepository.findById(id);
        if (optionalLivro.isPresent()) {
            Livro livro = optionalLivro.get();
            livro.setNome(livroDetails.getNome());
            livro.setAnotacao(livroDetails.getAnotacao());
            livro.setNota(livroDetails.getNota());
            Livro updatedLivro = livroRepository.save(livro);
            return new ResponseEntity<>(updatedLivro, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivro(@PathVariable Long id) {
        if (livroRepository.existsById(id)) {
            livroRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }
}

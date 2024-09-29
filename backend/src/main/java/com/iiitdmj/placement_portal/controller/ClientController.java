package com.iiitdmj.placement_portal.controller;

import com.iiitdmj.placement_portal.entity.Client;
import com.iiitdmj.placement_portal.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping("")
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public Client getClientById(@PathVariable Integer id) {
        return clientService.getClientById(id);
    }

    @PostMapping("")
    public Client addClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }

    @PutMapping("/{id}")
    public Client updateClient(@RequestBody Client client, @PathVariable Integer id) {
        return clientService.updateClient(client, id);
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Integer id) {
        clientService.deleteClient(id);
    }
}

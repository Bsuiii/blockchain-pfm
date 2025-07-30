
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NumberStorage {
    uint[] public nombres;

    constructor(uint[] memory _nombres) {
        nombres = _nombres;
    }

    function ajouterNombre(uint _nombre) public {
        nombres.push(_nombre);
    }

    function getElement(uint _index) public view returns (uint) {
        require(_index < nombres.length, "Index out of bounds");
        return nombres[_index];
    }

    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }

    function calcularSomme() public view returns (uint) {
        uint somme = 0;
        for (uint i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        return somme;
    }
}
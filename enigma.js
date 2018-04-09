"use strict";
const etw = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cogs = ["VZBRGITYUPSDNHLXAWMJQOFECK", "ESOVPZJAYQUIRHXLNFTGKDCMWB", "BDFHJLCPRTXVZNYEIWGAKMUSQO", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "EKMFLGDQVZNTOWYHXUSPAIBRCJ"];
const reflectors = ["YRUHQSLDPXNGOKMIEBFZCWVJAT", "EJMZALYXVBWFCRQUONTSPIKHGD"];
const ways = Object.freeze({"BACK":0, "FORTH":1});

Math.modulo = function(a, b)
{
    return a - b * Math.floor(a / b);
}
Math.randInt = function(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}


class Piece 
{
    constructor(wiring)
    {
        this.wiring = wiring;
    }

    permute(letter)
    {
        return this.wiring[etw.indexOf(letter)];
    }

    static getReflector()
    {
        return new Piece(reflectors[Math.randInt(reflectors.length)]);
    }
}

class Rotor 
{
    constructor(wiring, ringstellung, grundstellung, notch)
    {
        this.notch = notch;
        this.wiring = wiring;
        this.grundstellung = grundstellung;
        this.position = etw.indexOf(this.grundstellung);
        this.offset = etw.length - this.wiring.indexOf(ringstellung);
    }

    increment()
    {
        if(this.wiring[this.position] == this.notch)
        {
            this.position++;
            return true;
        } else {
            this.position++;
            return false;
        }
    }

    permute(letter, way)
    {
        if(way == ways.FORTH)
        {
            return this.wiring[Math.modulo(etw.indexOf(letter) + this.position - this.offset, etw.length)];
        } else {
            return etw[Math.modulo(this.wiring.indexOf(letter) - this.position + this.offset, etw.length)];
        }
    }

    reset()
    {
        this.position = etw.indexOf(this.grundstellung);
    }

    static getRotor()
    {
        return new Rotor(cogs[Math.randInt(cogs.length)], etw[Math.randInt(etw.length)], etw[Math.randInt(etw.length)]);
    }

    static getRotors()
    {
        let rotors = [];
        cogs.forEach(element => { rotors.push(new Rotor(element, etw[Math.randInt(etw.length)], etw[Math.randInt(etw.length)])); });
        return rotors;
    }
}

class Enigma
{
    constructor(plugboard, rotors, reflector)
    {
        this.plugboard = plugboard;
        this.rotors = rotors;
        this.reflector = reflector;
    }

    process(message)
    {
        let result = "";
        let tmp; 
        
        for(var i = 0; i < message.length; i++)
        {
            this.increment(0);
            tmp = this.plugboard.permute(message[i]);
            tmp = this.rotorHell(tmp, ways.FORTH);
            tmp = this.reflector.permute(tmp);
            tmp = this.rotorHell(tmp, ways.BACK);
            result += this.plugboard.permute(tmp);
            if((i % 4) == 3)
            {
                result += " ";
            }
        }
        return result;
    }

    increment(index)
    {
        if(index < this.rotors.length)
        {
            if(this.rotors[index].increment())
            {
                this.increment(index + 1);
            }
        }
    }

    rotorHell(letter, way)
    {
        let result = letter;
        for(let i = 0; i < this.rotors.length; i++)
        {
            if(way == ways.FORTH)
            {
                result = this.rotors[i].permute(result, way);
            } else {
                result = this.rotors[this.rotors.length - 1 - i].permute(result, way);
            }
        }
        return result;
    }

    reset()
    {
        this.rotors.forEach(element => { element.reset(); });
    }
}
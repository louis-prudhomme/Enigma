const etw = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rotors = ["VZBRGITYUPSDNHLXAWMJQOFECK", "ESOVPZJAYQUIRHXLNFTGKDCMWB", "BDFHJLCPRTXVZNYEIWGAKMUSQO", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "EKMFLGDQVZNTOWYHXUSPAIBRCJ"];
const reflectors = ["YRUHQSLDPXNGOKMIEBFZCWVJAT", "EJMZALYXVBWFCRQUONTSPIKHGD"];

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
    constructor(wiring)
    {
        this.wiring = wiring;
        this.position = 0;
    }

    increment()
    {
        this.position++;
    }

    permuteForth(letter)
    {
        return this.wiring[Math.modulo(etw.indexOf(letter) + this.position, etw.length)];
    }

    permuteBack(letter)
    {
        return etw[Math.modulo(this.wiring.indexOf(letter) - this.position, etw.length)];
    }

    reset()
    {
        this.position = 0;
    }

    static getRotor()
    {
        return new Rotor(rotors[Math.randInt(rotors.length)]);
    }
}

class Enigma
{
    constructor(plugboard, rotor, reflector)
    {
        this.plugboard = plugboard;
        this.rotor = rotor;
        this.reflector = reflector;
    }

    process(message)
    {
        let result = "";
        let tmp; 
        
        for(var i = 0; i < message.length; i++)
        {  
            this.rotor.increment();
            tmp = this.plugboard.permute(message[i]);
            tmp = this.rotor.permuteForth(tmp);
            tmp = this.reflector.permute(tmp);
            tmp = this.rotor.permuteBack(tmp);
            result += this.plugboard.permute(tmp);
        }
        return result;
    }

    reset()
    {
        this.rotor.reset();
    }
}
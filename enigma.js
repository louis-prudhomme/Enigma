class Piece 
{
    constructor(wiring)
    {
        this.wiring = wiring;
        this.etw = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    permute(letter)
    {
        return this.wiring[this.etw.indexOf(letter)];
    }
}

class Rotor 
{
    constructor(wiring)
    {
        this.wiring = wiring;

        this.position = 0;
        this.etw = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    increment()
    {
        this.position++;
    }

    permuteForth(letter)
    {
        return this.wiring[(this.etw.indexOf(letter) + this.position) % this.etw.length];
    }

    permuteBack(letter)
    {
        let index = this.wiring.indexOf(letter) - this.position;
        while(index < 0)
        {
            index = index + this.etw.length;
        }
        return this.etw[index];
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
}
const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client();



const prefix = '!';
const KEY = 'ODA5OTkwNTk4MzM3MzYzOTk4.YCdIhw.GPmxncc9qLNxgGPXZ51APfjsej8';

let steamids = [{name: 'juan', id: '13123'},{name: 'sonry', id: '76561198030567047'} ];

client.once('ready', () => {
    console.log('bot connected');
});


client.on('ready', () => {
    console.log(client.user.tag, 'is connected');
});

client.on('message', (msg) => {
    if(!msg.content.startsWith(prefix)) return;

    const arg = msg.content.slice(prefix.length).split(' ');
    const command = arg.shift().toLowerCase();
    
    

    if(command === 'test'){
        if(!arg.length){
            console.log('no arg');
            return msg.channel.send('this command needs arguments');
        }else if(arg[0] === 'asd'){
            return msg.channel.send('para registrar cuenta necesitas');
        }
        msg.channel.send(`command: ${msg.author.username} argument: ${arg}`);
    
    //SHOW COMMANDS
    }else if(command === 'commands' || command === 'command'){
        return msg.channel.send(`Los comandos son:
        !users <- Show users registered
        !register 'steam_id' <- register you
        !delete <- Delete you steamid for change
        !rank 'username' <- Show rank of user registered
        !match 'username' <- Show last match o actually of username registered`);

    //REGISTER STEAMID
    }else if(command === 'register'){
        if(!arg.length){
            return msg.channel.send('This command need other argument');
        }else if(arg.length == 1){
            const requerir = steamids.some((val)=> val.name == msg.author.username.toLocaleLowerCase());
            console.log(requerir);
            if(requerir) return msg.channel.send(`${msg.author.username} is alredy register`);             

            msg.channel.send(`${msg.author.username} is register`);
            steamids.push({
                name: msg.author.username.toLocaleLowerCase(),
                id: arg[0]
            });
            console.log(steamids);
            return; 
        }
        //DELETE REGISTER
    }else if(command === 'delete'){
        if(!arg.length){
            const requerir = steamids.some((val)=>val.name == msg.author.username.toLocaleLowerCase());
            if(!requerir) return msg.channel.send(`${msg.author.username} is not register`);
            
            for (a of steamids) {
                if(a.name == msg.author.username.toLocaleLowerCase()){
                    steamids.splice(steamids.indexOf(a));
                    console.log(steamids);
                }
            }
        }

        //USERS
    }else if(command === 'users'){
        if(!arg.length){
            var users = [];
            for (a of steamids) {
                users.push(a.name);
            }
            if(users.length) return msg.channel.send(`Users registered: ${users}`);
        }

        //RANKING
    }else if(command == 'rank'){
        if(!arg.length){
            const requerir = steamids.some((val)=>val.name == msg.author.username.toLocaleLowerCase());
            if(!requerir) return msg.channel.send(`${msg.author.username} is not register`);
            
            for (a of steamids) {
                if(a.name == msg.author.username.toLocaleLowerCase()){
                    console.log(msg.author.username, a.id);
                    rankIs(msg, msg.author.username, a.id);
                }
            }
        }else{
            nombre = arg.join(' ').toLocaleLowerCase();
            console.log(nombre);
            const requerir = steamids.some((val)=>val.name == nombre);
            if(!requerir) return msg.channel.send(`${nombre} is not register`);

            for (a of steamids) {
                if(a.name == nombre){
                    rankIs(msg,nombre,a.id);
                }
            }
        }

    }else if(command === 'match'){
        if(!arg.length){
            const requerir = steamids.some((val)=>val.name == msg.author.username.toLocaleLowerCase());
            if(!requerir) return msg.channel.send(`${msg.author.username} is not register`);
            lastMatch(msg, msg.author.username, 1);
            console.log('Ultima o actual partida de', msg.author.username);
        }else{
            nombre = arg.join(' ').toLocaleLowerCase();
            console.log(nombre);
            const requerir = steamids.some((val)=>val.name == nombre);
            if(!requerir) return msg.channel.send(`${nombre} is not register`);

            console.log('Ultima o actual partida de', nombre);
        }
    }
});




//FUNCIONES
async function rankIs(msg, name, id){
    try {
        const response = await axios(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=${id}&count=1`);
        msg.channel.send(`${name} ranking is ${response.data[0].rating}. You win ${response.data[0].num_wins} and losses ${response.data[0].num_losses} match.` );
    } catch (error) {
        msg.channel.send('ID Steam registed is incorrect or no have rated. You can use !delete for register other id.');
    }

}

async function lastMatch(msg, name, id){
    try {
        const response = await axios(`https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=76561199003184910`);
        // msg.channel.send(`${response.last_match}`);
        players = response.data.last_match.players;
        message = '';
        for (a of players) {
            message += `${a.name}: rating ${a.rating}\n`;
            console.log(a.name);
        }
        msg.channel.send(message);
    } catch (error) {
        console.log(error);
    }

}

client.login(KEY);
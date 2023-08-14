import check_commands from "../utils/bot/check_commands.js"

export default client => {
    

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.username}!`);
        //check_commands(client)
    });

}
const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database('./userbalDB.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Replies with the users balance'),
	async execute(interaction) {

		const db = new sqlite3.Database('./userbalDB.db');
		function getName(uid, callback){
			db.all(`SELECT balance FROM users WHERE userID = '${uid}'`, function (err, rows) {
			  if(err){
				  console.log(err);
			  }else{
				  //callback(rows[0].balance);
				  if (rows[0]) {
                    const balance = rows[0].balance;
                    callback(balance); // Pass the balance to the callback
                  } else {
                    callback(50); // Pass the balance to the callback
                  }
			  }
			  
			});
		}

		getName(`<@${interaction.user.id}>`,print);

		async function print(name) {
			await interaction.reply({content: `Your balance is: **${name}**`, ephemeral: true});
		}
		db.close();
	},
};

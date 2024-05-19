const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3');
const Discord = require('discord.js');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');
const file2 = new AttachmentBuilder('./assets/horse.jpg');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stat')
		.setDescription('Replies with your bot stats!'),
	async execute(interaction) {

    const db = new sqlite3.Database('./userbalDB.db');
    const guildId = interaction.guildId;

    function getUserStatsForGuild(guildId, callback) {
	
			// Query to get user statistics for the provided guild ID
			let query = `
				SELECT u.id, u.userID, u.current_streak, u.wins
				FROM guilds gs
				INNER JOIN users u ON gs.UserID = u.id
				WHERE gs.GuildID = ?;
			`;
			const params = [guildId];
		
			// Execute the query
			db.all(query, params, (err, rows) => {
				if (err) {
					console.error(err.message);
					callback(err, null);
				} else {
					//Convert the rows into a dictionary
					let result = {};
					rows.forEach(row => {
						result[row.id] = {
							name: row.userID,
              wins: row.wins,
							streak: row.current_streak
						};
					});
					callback(null, rows);
				}
			});
		
			// Close the database connection
			//db.close();
		}

		function getName(uid, callback){
			db.all(`SELECT * FROM users WHERE userID = '${uid}'`, function (err, rows) {
			  if(err){
				  console.log(err);
			  }else{
				  //callback(rows[0].balance);
				  if (rows[0]) {
                    const balance = rows[0].balance;
                    const current_streak = rows[0].current_streak
                    const longest_streak = rows[0].longest_streak
                    const wins = rows[0].wins
                    const losses = rows[0].total_races - rows[0].wins
                    const ratio = rows[0].wins / (rows[0].total_races - rows[0].wins)
                    callback(balance,current_streak,longest_streak,wins,losses,ratio); // Pass the balance to the callback
                  } else {
                    callback(50, 0, 0, 0, 0, 0); // Pass the balance to the callback
                  }
			  }
			  
			});
		}

		getName(`<@${interaction.user.id}>`,print);

		async function print(balance,current_streak,longest_streak,wins,losses,ratio) {

      getUserStatsForGuild(guildId, async (err, userStats) => {

        function sortByKey(array, key) {
          return array.sort((a, b) => {
              if (a[key] < b[key]) {
                  return 1;
              }
              if (a[key] > b[key]) {
                  return -1;
              }
              return 0;
          });
        }

        function posCheck(position) {
          if (position+ 1 == 1){
            return `🥇`
          }
          else if (position + 1 == 2){
            return `🥈`
          }
          else if (position + 1 == 3){
            return `🥉`
          }
          else{
            return position + 1
          }
        }
      
       
        if (err) {
          console.error('Error fetching user stats:', err);
        } else {

          const win_order = sortByKey(userStats, 'wins');
          let win_pos = win_order.findIndex(obj => obj["userID"] === `<@${interaction.user.id}>`);
          win_pos = posCheck(win_pos)

          const streak_order = sortByKey(userStats, 'current_streak');          
          let streak_pos = streak_order.findIndex(obj => obj["userID"] === `<@${interaction.user.id}>`);
          streak_pos = posCheck(streak_pos)


          let embed = new Discord.EmbedBuilder()
              .setTitle("»│ Your Stats │«")
              .setColor(0xff0000)
              .setAuthor({name:`ˢᵗᵃᵗᶦˢᵗᶦᶜˢ`})
              .setThumbnail('attachment://horse.jpg')
              .setDescription("Here are your stats across the board!")
              .addFields({ name: 'Balance', value: `**${balance}**`, inline: true })
              .addFields({ name: 'Current Streak:', value: `**${current_streak}**`, inline: true })
              .addFields({ name: 'Longest Streak:', value: `**${longest_streak}**`, inline: true })
              .addFields({ name: 'Wins:', value: `**${wins}**`, inline: true })
              .addFields({ name: 'Losses:', value: `**${losses}**`, inline: true })
              .addFields({ name: 'WL Ratio:', value: `**${ratio}**`, inline: true })
              .addFields({ name: 'Win Position:', value: `**${win_pos}**`, inline: true })
              .addFields({ name: 'Streak Position:', value: `**${streak_pos}**`, inline: true })
              .setFooter({ text: '𝗚𝗮𝗺𝗯𝗹𝗲 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆 | 𝐆𝐨𝐨𝐝 𝐋𝐮𝐜𝐤 |', iconURL: 'attachment://horse.jpg' })
              .setTimestamp();
              await interaction.reply({ embeds: [embed], files: [file2], ephemeral: true});
        }
      });
		}
		db.close();
	},
};
<<<<<<< HEAD
const { SlashCommandBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder } = require('discord.js');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const file = new AttachmentBuilder('./assets/horse.jpg');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('race')
		.setDescription('Time for Racing'),
  async execute(interaction) {
    const db = new sqlite3.Database('./userbalDB.db');

    function getRandomNumberBetween(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    function getUsersByHorse(horseToFind) {
      const usersWithBets = new Object();
      for (const user in userBets) {
        if (userBets.hasOwnProperty(user) && userBets[user].horse === horseToFind) {
          usersWithBets[user] = {outcome: 'win'};
        }
        else{
          usersWithBets[user] = {outcome: 'loss'};
        }
      }
      return usersWithBets;
    }

    let horsesDict = new Object();
    let userBets = new Object();

    const horseNum = 4;
    const name = "horse";
    var numbers = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
    for (let i = 0; i < horseNum; i++) {
      var x = getRandomNumberBetween(0,9-i);
      let horse = name.concat(i);
      var odds = getRandomNumberBetween(1,15).toString();
      odds = odds.concat("/", getRandomNumberBetween(1,5));
      horsesDict[horse] = {horseNum: numbers[x], odd: odds};
      if (x > -1) { // only splice array when item is found
        numbers.splice(x, 1); // 2nd parameter means remove one item only
      }
    }

    // Nightbolt
    // Mustang
    // Seabiscuit
    // Thunder
    const embed = new Discord.EmbedBuilder()
      .setTitle('»│ 𝐑𝐀𝐂𝐄 𝐒𝐓𝐀𝐑𝐓𝐒 𝐒𝐎𝐎𝐍 │«')
      .setColor(0xff0000)
      .setAuthor({name:`ᴿᵃᶜᵉ ᴸᵉᵃᵈᵉʳ`})
      .setThumbnail('attachment://horse.jpg')
      .setDescription(`\n │ 📜 - 𝐎𝐃𝐃𝐒 -📜 \n│ ${horsesDict["horse0"].horseNum} │ ${horsesDict["horse0"].odd} \n│ ${horsesDict["horse1"].horseNum} │ ${horsesDict["horse1"].odd} \n│ ${horsesDict["horse2"].horseNum} │ ${horsesDict["horse2"].odd} \n│ ${horsesDict["horse3"].horseNum} │ ${horsesDict["horse3"].odd}`)
      .addFields({ name: '𝐏𝐥𝐚𝐜𝐞 𝐲𝐨𝐮𝐫 𝐛𝐞𝐭𝐬 𝐧𝐞𝐱𝐭 :', value: 'React to the next message to place a bet\n» 💯 - 𝗔𝗟𝗟 𝗜𝗡\n» 🔟 - 𝘁𝗲𝗻 coins \n» 5️⃣ - 𝗳𝗶𝘃𝗲 coins \n\n ⬇️ 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂𝗿 𝗵𝗼𝗿𝘀𝗲 𝗻𝗼𝘄 ⬇️', inline: true })
      .setFooter({ text: '𝗚𝗮𝗺𝗯𝗹𝗲 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆 | 𝐆𝐨𝐨𝐝 𝐋𝐮𝐜𝐤 |', iconURL: 'attachment://horse.jpg' })
      .setTimestamp();

    const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse0"].horseNum)
					.setDescription('Nightbolt')
					.setValue('0'),
				new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse1"].horseNum)
					.setDescription('Mustang')
					.setValue('1'),
				new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse2"].horseNum)
					.setDescription('Seabiscuit')
					.setValue('2'),
        new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse3"].horseNum)
					.setDescription('Thunder')
					.setValue('3'),
		  );

		const row = new ActionRowBuilder()
		  .addComponents(select);

    const response = await interaction.reply({
      embeds: [embed],
      components: [row],
      files: [file]
    });

    const collector = response.createMessageComponentCollector({ time: 30000 });
    
    collector.on('collect', async i => {
      const selection = i.values[0];
      let horse = name.concat(selection);
      userBets[i.user] = {horse: horse, bet: 5, win: 0};
      await i.reply({ content: `You selected horse: ${horsesDict[horse].horseNum}`, ephemeral: true });
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        const text = `1. 🏁 -------------------------- 🏇 :**${horsesDict["horse0"].horseNum}**: \n1. 🏁 -------------------------- 🏇 :**${horsesDict["horse1"].horseNum}**: \n1. 🏁 -------------------------- 🏇 :**${horsesDict["horse2"].horseNum}**: \n1. 🏁 -------------------------- 🏇 :**${horsesDict["horse3"].horseNum}**:`;
        
        const oddSelect = new StringSelectMenuBuilder()
          .setCustomId('starter')
          .setPlaceholder('Make a selection!')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('5️⃣')
              .setDescription('Bet 5')
              .setValue('5'),
            new StringSelectMenuOptionBuilder()
              .setLabel('🔟')
              .setDescription('Bet 10')
              .setValue('10'),
            new StringSelectMenuOptionBuilder()
              .setLabel('💯')
              .setDescription('Go ALL IN')
              .setValue('100'),
          );

        const row = new ActionRowBuilder()
          .addComponents(oddSelect);


        // Get the original reply
        const originalReply = await interaction.fetchReply();
        // Clear the content and components
        const betting = await originalReply.edit({
          content: text,
          embeds: [], // Clear the embed
          components: [row],
          files: []
        });

        const collectorBet = betting.createMessageComponentCollector({ time: 30000 });

        collectorBet.on('collect', async i => {
          const selection = i.values[0];
          // SQL for all balance in user when selection == 100
          if (i.user in userBets){
            userBets[i.user].bet = selection;
            console.log(userBets);
          }
          await i.reply({ content: `You selected bet: ${selection}`, ephemeral: true });
        });

        collectorBet.on('end', async (collected, reason) => {
            const originalReply = await interaction.fetchReply();
            await originalReply.edit({
              content: text,
              embeds: [], // Clear the embed
              components: [],
            });
            
          
            // LOGIC FOR VISUAL RACE (call function to generate new line each time in loop)
            
            async function selectOptionWithBias(options, biases) {
            
              // Normalize biases to sum up to 1
              const totalBias = biases.reduce((sum, bias) => sum + bias, 0);
              const normalizedBiases = biases.map((bias) => bias / totalBias);
            
              // Generate a random number between 0 and 1
              const randomNumber = Math.random();
            
              // Calculate the cumulative probabilities
              const cumulativeProbabilities = [];
              let cumulativeProbability = 0;
            
              for (const bias of normalizedBiases) {
                cumulativeProbability += bias;
                cumulativeProbabilities.push(cumulativeProbability);
              }
            
              // Find the selected option
              for (let i = 0; i < cumulativeProbabilities.length; i++) {
                if (randomNumber <= cumulativeProbabilities[i]) {
                  return options[i];
                }
              }
            
              // This should not happen, but return the last option as a fallback
              return options[options.length - 1];
            }

            async function calcBias(horseIndex){
              const bias = [];
              for (const horses in horseIndex){
                const parts = horseIndex[horses].odd.split('/');
                const result = 1/ ((parseFloat(parts[0]) / parseFloat(parts[1])) + 1);
                bias.push(result);
              }
              return bias;
            }

            async function areAllElementsEqual(arr, targetNumber) {
              return arr.every((element) => element === targetNumber);
            }

            async function editRaceState(raceText,selected,state,winner,end){
              var result = raceText;
              var num = getRandomNumberBetween(1,5);
              if (state[selected] + num < 26){
                result = raceText.substr(0,3) + raceText.substr(3 + num) + raceText.substr(3, num);
                state[selected] = state[selected] + num;
              }else{
                if (state[selected] !=26 ){
                  num = 26 - state[selected];
                  result = raceText.substr(0,3) + raceText.substr(3 + num) + raceText.substr(3, num);
                  if (state.find((element) => element == 26)){
                    state[selected] = 26;
                  } else{
                    state[selected] = 26;
                    winner = selected;
                  }
                }
              }
              const check = await areAllElementsEqual(state, 26);
              if (check) {
                end = true;
              } else {
                end = false;
              }
              return [result,winner,end,state];
            }

            function removeIndexesFromArray(sourceArray, targetArray,bias) {
              // Find all indexes in the sourceArray that have a value of 26
              for (let i = 0; i < sourceArray.length; i++) {
                if (sourceArray[i] === 26) {
                  const index = targetArray.indexOf(i);
                  if (index !== -1){
                    targetArray.splice(index, 1);
                    bias.splice(index,1);
                  }
                }
              }
            }

            async function performProcessing() {
              return new Promise(async (resolve, reject) => {
                //Convert odds to a bias
                const bias = await calcBias(horsesDict);
                const options = [0, 1, 2, 3];
                var raceText = [`🏁 -------------------------- 🏇`,`🏁 -------------------------- 🏇`,`🏁 -------------------------- 🏇`,`🏁 -------------------------- 🏇`];
                let state = [0,0,0,0];
                let end = false; 
                var winner;
                while (!end) {
                  removeIndexesFromArray(state,options,bias);
                  const selectedOption = await selectOptionWithBias(options, bias);
                  [raceText[selectedOption],winner,end,state] = await editRaceState(raceText[selectedOption],selectedOption,state,winner,end);
                  var printText = [];
                  for (let i = 0; i < 4; i++){
                    printText.push(raceText[i].concat(` :**${horsesDict["horse".concat(i)].horseNum}**:`));
                  }
                  await interaction.editReply({content:`${printText.join(`\n`)}`, time: 300});
                }
                
                resolve(winner);
              
              });
            }

            (async () => {
              try {
                const winner = await performProcessing();
                let horse = name.concat(winner);
                
                // HANDLING ODDS
                const usersWhoBetOnHorse = getUsersByHorse(horse);
                
                function calculateWin(odd, bet, balance){
                  var profit = 0; 
                  const parts = odd.split('/');
                  const result = parseFloat(parts[0]) / parseFloat(parts[1]);
                  profit = Math.floor((parseInt(bet) * (result)) + parseInt(balance));
                  return profit
                }

                function getDetails(userID, callback) {
                  const sql = `SELECT * FROM users WHERE userID = ?`; // Replace 'your_table_name' with your table name
                  const params = [userID];
                
                  db.get(sql, params, (err, row) => {
                    if (err) {
                      console.error(err.message);
                      callback(err, null); // Pass the error to the callback
                    } else {
                      if (row) {
                        const balance = row.balance;
                        const total_races= row.total_races 
                        const current_streak = row.current_streak
                        const longest_streak = row.longest_streak
                        const wins = row.wins
                        callback(null,balance,total_races,current_streak,longest_streak,wins);  // Pass the balance to the callback
                      } else {
                        callback(null, null); // Pass the balance to the callback
                      }
                    }
                  });
                }
                
                for (const user in usersWhoBetOnHorse){
                
                  getDetails(user, (err, balance,total_races,current_streak,longest_streak,wins) => {
                    var newBalance = 0;
                    if (err) {
                      // Handle the error here
                      console.error(`Error retrieving balance: ${err.message}`);
                    } else if (balance !== null) {
                      // Manipulate the balance here, for example, increment it by 100
                      if (userBets[user].bet == 100){
                        // SQL query for balance
                        if (usersWhoBetOnHorse[user].outcome == 'win'){
                            // calculate win with balance
                            newBalance = calculateWin(horsesDict[horse].odd, balance, balance);
                        }
                        else{
                            // set account back to 5
                            newBalance = 5;
                        }
                      }
                      else{
                        if (usersWhoBetOnHorse[user].outcome == 'win'){
                          // calculate win with userBets[user].bet against horsesDict[horse].odd
                          newBalance = calculateWin(horsesDict[horse].odd, userBets[user].bet, balance);
                        }
                        else{
                          // FIX userBets[user].bet SO NO GO negative 
                          if (balance != 5 && userBets[user].bet < balance){
                            newBalance = balance - userBets[user].bet;
                          }
                          else {
                            newBalance = 5;
                          }
                        }
                      }

                      total_races++;
                      if (usersWhoBetOnHorse[user].outcome == 'win'){
                        current_streak++;
                        wins++;
                        if (current_streak > longest_streak){
                          longest_streak = current_streak
                        }
                      }
                      else {
                        current_streak = 0;
                      }

                    
                      console.log(`User ${user} balance: ${balance}, New balance: ${newBalance}`);
                      
                      // Update the balance in the database (if needed)
                      
                      const updateSql = `UPDATE users SET balance = ?, total_races = ?, wins = ?, current_streak = ?, longest_streak = ? WHERE userID = ?`;
                      const updateParams = [newBalance,total_races,wins,current_streak,longest_streak, user];
                  
                      db.run(updateSql, updateParams, (updateErr) => {
                        if (updateErr) {
                          console.error(`Error updating balance: ${updateErr.message}`);
                        } else {
                          console.log(`User ${user} balance updated to ${newBalance}`);
                        }
                      });
              
                    } else {
                      if (usersWhoBetOnHorse[user].outcome == 'win'){
                        // calculate win with balance
                        newBalance = calculateWin(horsesDict[horse].odd, userBets[user].bet,50);
                        current_streak = 1;
                        longest_streak = 1;
                        wins = 1;
                      }
                      else{
                          // set account back to 5
                          newBalance = 50;
                          current_streak = 0;
                          longest_streak = 0;
                          wins = 0;
                      }

                      const updateSql = `INSERT INTO users (userID, balance, total_races, wins, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?)`;
                      const updateParams = [user,newBalance, 1,wins,current_streak,longest_streak];
                  
                      db.run(updateSql, updateParams, (updateErr) => {
                        if (updateErr) {
                          console.error(`Error updating balance: ${updateErr.message}`);
                        } else {
                          console.log(`User ${user} balance updated to ${newBalance}`);
                        }
                      });
                    }
                  });
                }

                const winUserIDs = [];
                var test;
                for (const userID in usersWhoBetOnHorse) {
                  if (usersWhoBetOnHorse[userID].outcome === 'win') {
                    winUserIDs.push(userID);
                  }
                }
                if (winUserIDs.length > 0) {
                  test = winUserIDs.toString(); 
                } else {
                  test = 'No users bet on the winning horse';
                }
                
                //│ 📜 - 𝐏𝐀𝐘𝐎𝐔𝐓 -📜 │ 
                const embedEND = new Discord.EmbedBuilder()
                  .setTitle('»│ 𝐑𝐄𝐒𝐔𝐋𝐓𝐒 │«')
                  .setColor(0xff0000)
                  .setAuthor({name:`ᴿᵃᶜᵉ ᴿᵉˢᵘˡᵗˢ`})
                  .setThumbnail('attachment://horse.jpg')
                  .setDescription(`\n\n ${test} `)
                  .addFields({ name: '𝐖𝐢𝐧𝐧𝐞𝐫:', value: `${horsesDict[horse].horseNum}`, inline: true })
                  .addFields({ name: '𝐎𝐃𝐃𝐒', value: `│ ${horsesDict["horse0"].horseNum} │ ${horsesDict["horse0"].odd} \n│ ${horsesDict["horse1"].horseNum} │ ${horsesDict["horse1"].odd} \n│ ${horsesDict["horse2"].horseNum} │ ${horsesDict["horse2"].odd} \n│ ${horsesDict["horse3"].horseNum} │ ${horsesDict["horse3"].odd}`, inline: true})
                  .setFooter({ text: '𝗚𝗮𝗺𝗯𝗹𝗲 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆 | 𝐓𝐡𝐚𝐧𝐤𝐬 𝐟𝐨𝐫 𝐏𝐥𝐚𝐲𝐢𝐧𝐠 |', iconURL: 'attachment://horse.jpg' })
                  .setTimestamp();
              
                await interaction.editReply({
                  content: '',
                  embeds: [embedEND],
                  files: [file]
                });

                db.close();
            } catch (error) {
              console.error(`Error occurred: ${error}`);
            }
            })();
            
        });
      }
    });
  },
=======
const { SlashCommandBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder } = require('discord.js');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const file = new AttachmentBuilder('./assets/horse.jpg');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('race')
		.setDescription('Time for Racing'),
  async execute(interaction) {
    const db = new sqlite3.Database('./userbalDB.db');

    function getRandomNumberBetween(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    function getUsersByHorse(horseToFind) {
      const usersWithBets = new Object();
      for (const user in userBets) {
        if (userBets.hasOwnProperty(user) && userBets[user].horse === horseToFind) {
          usersWithBets[user] = {outcome: 'win'};
        }
        else{
          usersWithBets[user] = {outcome: 'loss'};
        }
      }
      return usersWithBets;
    }

    let horsesDict = new Object();
    let userBets = new Object();

    const horseNum = 4;
    const name = "horse";
    var numbers = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
    for (let i = 0; i < horseNum; i++) {
      var x = getRandomNumberBetween(0,9-i);
      let horse = name.concat(i);
      var odds = getRandomNumberBetween(1,15).toString();
      odds = odds.concat("/", getRandomNumberBetween(1,5));
      horsesDict[horse] = {horseNum: numbers[x], odd: odds};
      if (x > -1) { // only splice array when item is found
        numbers.splice(x, 1); // 2nd parameter means remove one item only
      }
    }

    // Nightbolt
    // Mustang
    // Seabiscuit
    // Thunder
    const embed = new Discord.EmbedBuilder()
      .setTitle('»│ 𝐑𝐀𝐂𝐄 𝐒𝐓𝐀𝐑𝐓𝐒 𝐒𝐎𝐎𝐍 │«')
      .setColor(0xff0000)
      .setAuthor({name:`ᴿᵃᶜᵉ ᴸᵉᵃᵈᵉʳ`})
      .setThumbnail('attachment://horse.jpg')
      .setDescription(`\n │ 📜 - 𝐎𝐃𝐃𝐒 -📜 \n│ ${horsesDict["horse0"].horseNum} │ ${horsesDict["horse0"].odd} \n│ ${horsesDict["horse1"].horseNum} │ ${horsesDict["horse1"].odd} \n│ ${horsesDict["horse2"].horseNum} │ ${horsesDict["horse2"].odd} \n│ ${horsesDict["horse3"].horseNum} │ ${horsesDict["horse3"].odd}`)
      .addFields({ name: '𝐏𝐥𝐚𝐜𝐞 𝐲𝐨𝐮𝐫 𝐛𝐞𝐭𝐬 𝐧𝐞𝐱𝐭 :', value: 'React to the next message to place a bet\n» 💯 - 𝗔𝗟𝗟 𝗜𝗡\n» 🔟 - 𝘁𝗲𝗻 coins \n» 5️⃣ - 𝗳𝗶𝘃𝗲 coins \n\n ⬇️ 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂𝗿 𝗵𝗼𝗿𝘀𝗲 𝗻𝗼𝘄 ⬇️', inline: true })
      .setFooter({ text: '𝗚𝗮𝗺𝗯𝗹𝗲 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆 | 𝐆𝐨𝐨𝐝 𝐋𝐮𝐜𝐤 |', iconURL: 'attachment://horse.jpg' })
      .setTimestamp();

    const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse0"].horseNum)
					.setDescription('Nightbolt')
					.setValue('0'),
				new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse1"].horseNum)
					.setDescription('Mustang')
					.setValue('1'),
				new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse2"].horseNum)
					.setDescription('Seabiscuit')
					.setValue('2'),
        new StringSelectMenuOptionBuilder()
					.setLabel(horsesDict["horse3"].horseNum)
					.setDescription('Thunder')
					.setValue('3'),
		  );

		const row = new ActionRowBuilder()
		  .addComponents(select);

    const response = await interaction.reply({
      embeds: [embed],
      components: [row],
      files: [file]
    });

    const collector = response.createMessageComponentCollector({ time: 30000 });
    
    collector.on('collect', async i => {
      const selection = i.values[0];
      let horse = name.concat(selection);
      userBets[i.user] = {horse: horse, bet: 5, win: 0};
      await i.reply({ content: `You selected horse: ${horsesDict[horse].horseNum}`, ephemeral: true });
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        const text = `1. 🏁 -------------------------- 🏇 :**${horsesDict["horse0"].horseNum}**: \n1. 🏁 -------------------------- 🏇 :**${horsesDict["horse1"].horseNum}**: \n1. 🏁 -------------------------- 🏇 :**${horsesDict["horse2"].horseNum}**: \n1. 🏁 -------------------------- 🏇 :**${horsesDict["horse3"].horseNum}**:`;
        
        const oddSelect = new StringSelectMenuBuilder()
          .setCustomId('starter')
          .setPlaceholder('Make a selection!')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('5️⃣')
              .setDescription('Bet 5')
              .setValue('5'),
            new StringSelectMenuOptionBuilder()
              .setLabel('🔟')
              .setDescription('Bet 10')
              .setValue('10'),
            new StringSelectMenuOptionBuilder()
              .setLabel('💯')
              .setDescription('Go ALL IN')
              .setValue('100'),
          );

        const row = new ActionRowBuilder()
          .addComponents(oddSelect);


        // Get the original reply
        const originalReply = await interaction.fetchReply();
        // Clear the content and components
        const betting = await originalReply.edit({
          content: text,
          embeds: [], // Clear the embed
          components: [row],
          files: []
        });

        const collectorBet = betting.createMessageComponentCollector({ time: 30000 });

        collectorBet.on('collect', async i => {
          const selection = i.values[0];
          // SQL for all balance in user when selection == 100
          if (i.user in userBets){
            userBets[i.user].bet = selection;
            console.log(userBets);
          }
          await i.reply({ content: `You selected bet: ${selection}`, ephemeral: true });
        });

        collectorBet.on('end', async (collected, reason) => {
            const originalReply = await interaction.fetchReply();
            await originalReply.edit({
              content: text,
              embeds: [], // Clear the embed
              components: [],
            });
            
          
            // LOGIC FOR VISUAL RACE (call function to generate new line each time in loop)
            
            async function selectOptionWithBias(options, biases) {
            
              // Normalize biases to sum up to 1
              const totalBias = biases.reduce((sum, bias) => sum + bias, 0);
              const normalizedBiases = biases.map((bias) => bias / totalBias);
            
              // Generate a random number between 0 and 1
              const randomNumber = Math.random();
            
              // Calculate the cumulative probabilities
              const cumulativeProbabilities = [];
              let cumulativeProbability = 0;
            
              for (const bias of normalizedBiases) {
                cumulativeProbability += bias;
                cumulativeProbabilities.push(cumulativeProbability);
              }
            
              // Find the selected option
              for (let i = 0; i < cumulativeProbabilities.length; i++) {
                if (randomNumber <= cumulativeProbabilities[i]) {
                  return options[i];
                }
              }
            
              // This should not happen, but return the last option as a fallback
              return options[options.length - 1];
            }

            async function calcBias(horseIndex){
              const bias = [];
              for (const horses in horseIndex){
                const parts = horseIndex[horses].odd.split('/');
                const result = 1/ ((parseFloat(parts[0]) / parseFloat(parts[1])) + 1);
                bias.push(result);
              }
              return bias;
            }

            async function areAllElementsEqual(arr, targetNumber) {
              return arr.every((element) => element === targetNumber);
            }

            async function editRaceState(raceText,selected,state,winner,end){
              var result = raceText;
              var num = getRandomNumberBetween(1,5);
              if (state[selected] + num < 26){
                result = raceText.substr(0,3) + raceText.substr(3 + num) + raceText.substr(3, num);
                state[selected] = state[selected] + num;
              }else{
                if (state[selected] !=26 ){
                  num = 26 - state[selected];
                  result = raceText.substr(0,3) + raceText.substr(3 + num) + raceText.substr(3, num);
                  if (state.find((element) => element == 26)){
                    state[selected] = 26;
                  } else{
                    state[selected] = 26;
                    winner = selected;
                  }
                }
              }
              const check = await areAllElementsEqual(state, 26);
              if (check) {
                end = true;
              } else {
                end = false;
              }
              return [result,winner,end,state];
            }

            function removeIndexesFromArray(sourceArray, targetArray,bias) {
              // Find all indexes in the sourceArray that have a value of 26
              for (let i = 0; i < sourceArray.length; i++) {
                if (sourceArray[i] === 26) {
                  const index = targetArray.indexOf(i);
                  if (index !== -1){
                    targetArray.splice(index, 1);
                    bias.splice(index,1);
                  }
                }
              }
            }

            async function performProcessing() {
              return new Promise(async (resolve, reject) => {
                //Convert odds to a bias
                const bias = await calcBias(horsesDict);
                const options = [0, 1, 2, 3];
                var raceText = [`🏁 -------------------------- 🏇`,`🏁 -------------------------- 🏇`,`🏁 -------------------------- 🏇`,`🏁 -------------------------- 🏇`];
                let state = [0,0,0,0];
                let end = false; 
                var winner;
                while (!end) {
                  removeIndexesFromArray(state,options,bias);
                  const selectedOption = await selectOptionWithBias(options, bias);
                  [raceText[selectedOption],winner,end,state] = await editRaceState(raceText[selectedOption],selectedOption,state,winner,end);
                  var printText = [];
                  for (let i = 0; i < 4; i++){
                    printText.push(raceText[i].concat(` :**${horsesDict["horse".concat(i)].horseNum}**:`));
                  }
                  await interaction.editReply({content:`${printText.join(`\n`)}`, time: 300});
                }
                
                resolve(winner);
              
              });
            }

            (async () => {
              try {
                const winner = await performProcessing();
                let horse = name.concat(winner);
                
                // HANDLING ODDS
                const usersWhoBetOnHorse = getUsersByHorse(horse);
                
                function calculateWin(odd, bet, balance){
                  var profit = 0; 
                  const parts = odd.split('/');
                  const result = parseFloat(parts[0]) / parseFloat(parts[1]);
                  profit = Math.floor((parseInt(bet) * (result)) + parseInt(balance));
                  return profit
                }

                function getBalance(userID, callback) {
                  const sql = `SELECT balance FROM users WHERE userID = ?`; // Replace 'your_table_name' with your table name
                  const params = [userID];
                
                  db.get(sql, params, (err, row) => {
                    if (err) {
                      console.error(err.message);
                      callback(err, null); // Pass the error to the callback
                    } else {
                      if (row) {
                        const balance = row.balance;
                        callback(null, balance); // Pass the balance to the callback
                      } else {
                        callback(null, null); // Pass the balance to the callback
                      }
                    }
                  });
                }
                
                for (const user in usersWhoBetOnHorse){
                
                  getBalance(user, (err, balance) => {
                    var newBalance = 0;
                    if (err) {
                      // Handle the error here
                      console.error(`Error retrieving balance: ${err.message}`);
                    } else if (balance !== null) {
                      // Manipulate the balance here, for example, increment it by 100
                      if (userBets[user].bet == 100){
                        // SQL query for balance
                        if (usersWhoBetOnHorse[user].outcome == 'win'){
                            // calculate win with balance
                            newBalance = calculateWin(horsesDict[horse].odd, balance, balance);
                        }
                        else{
                            // set account back to 5
                            newBalance = 5;
                        }
                      }
                      else{
                        if (usersWhoBetOnHorse[user].outcome == 'win'){
                          // calculate win with userBets[user].bet against horsesDict[horse].odd
                          newBalance = calculateWin(horsesDict[horse].odd, userBets[user].bet, balance);
                        }
                        else{
                          // FIX userBets[user].bet SO NO GO negative 
                          if (balance != 5 && userBets[user].bet < balance){
                            newBalance = balance - userBets[user].bet;
                          }
                          else {
                            newBalance = 5;
                          }
                        }
                      }
                    
                      console.log(`User ${user} balance: ${balance}, New balance: ${newBalance}`);
                      
                      // Update the balance in the database (if needed)
                      
                      const updateSql = `UPDATE users SET balance = ? WHERE userID = ?`;
                      const updateParams = [newBalance, user];
                  
                      db.run(updateSql, updateParams, (updateErr) => {
                        if (updateErr) {
                          console.error(`Error updating balance: ${updateErr.message}`);
                        } else {
                          console.log(`User ${user} balance updated to ${newBalance}`);
                        }
                      });
              
                    } else {
                      if (usersWhoBetOnHorse[user].outcome == 'win'){
                        // calculate win with balance
                        newBalance = calculateWin(horsesDict[horse].odd, userBets[user].bet,50);
                      }
                      else{
                          // set account back to 5
                          newBalance = 50;
                      }

                      const updateSql = `INSERT INTO users (userID, balance) VALUES (?, ?)`;
                      const updateParams = [user,newBalance];
                  
                      db.run(updateSql, updateParams, (updateErr) => {
                        if (updateErr) {
                          console.error(`Error updating balance: ${updateErr.message}`);
                        } else {
                          console.log(`User ${user} balance updated to ${newBalance}`);
                        }
                      });
                    }
                  });
                }

                const winUserIDs = [];
                var test;
                for (const userID in usersWhoBetOnHorse) {
                  if (usersWhoBetOnHorse[userID].outcome === 'win') {
                    winUserIDs.push(userID);
                  }
                }
                if (winUserIDs.length > 0) {
                  test = winUserIDs.toString(); 
                } else {
                  test = 'No users bet on the winning horse';
                }
                
                //│ 📜 - 𝐏𝐀𝐘𝐎𝐔𝐓 -📜 │ 
                const embedEND = new Discord.EmbedBuilder()
                  .setTitle('»│ 𝐑𝐄𝐒𝐔𝐋𝐓𝐒 │«')
                  .setColor(0xff0000)
                  .setAuthor({name:`ᴿᵃᶜᵉ ᴿᵉˢᵘˡᵗˢ`})
                  .setThumbnail('attachment://horse.jpg')
                  .setDescription(`\n\n ${test} `)
                  .addFields({ name: '𝐖𝐢𝐧𝐧𝐞𝐫:', value: `${horsesDict[horse].horseNum}`, inline: true })
                  .addFields({ name: '𝐎𝐃𝐃𝐒', value: `│ ${horsesDict["horse0"].horseNum} │ ${horsesDict["horse0"].odd} \n│ ${horsesDict["horse1"].horseNum} │ ${horsesDict["horse1"].odd} \n│ ${horsesDict["horse2"].horseNum} │ ${horsesDict["horse2"].odd} \n│ ${horsesDict["horse3"].horseNum} │ ${horsesDict["horse3"].odd}`, inline: true})
                  .setFooter({ text: '𝗚𝗮𝗺𝗯𝗹𝗲 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆 | 𝐓𝐡𝐚𝐧𝐤𝐬 𝐟𝐨𝐫 𝐏𝐥𝐚𝐲𝐢𝐧𝐠 |', iconURL: 'attachment://horse.jpg' })
                  .setTimestamp();
              
                await interaction.editReply({
                  content: '',
                  embeds: [embedEND],
                  files: [file]
                });

                db.close();
            } catch (error) {
              console.error(`Error occurred: ${error}`);
            }
            })();
            
        });
      }
    });
  },
>>>>>>> 00ed65a7fe94b4c40cffe90da83b29b0d0341439
};
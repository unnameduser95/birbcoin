import Discord from 'discord.js';

import { findUser } from '../helpers/user';
import { Command } from '../typedefs';
const claimCooldown = Number(process.env.CLAIM_COOLDOWN);  // number of milliseconds before user can claim again
const claimCurrency = Number(process.env.CLAIM_CURRENCY);  // amount of currency for each claim

const claimCommand: Command = {
  name: 'claim',
  type: "General",
  allowDMs: true,
  description: 'Claim your hourly birbcoins.',
  execute: async (message, args) => {
    const serverId = message.guild ? message.guild.id : undefined;

    const userId = message.author.id;
    const username = message.author.tag;
    const user = await findUser(userId, username, true, serverId);

    const lastClaimed = user!.lastClaimedDaily;

    const now = new Date();
    // how long it has been since claim
    const difference = new Date(now.getTime() - lastClaimed.getTime());

    // claim cooldown, subtracted by difference
    const differenceHour = new Date(claimCooldown - difference.getTime());

    if (difference.getTime() <= claimCooldown) {  // not enough time; user needs to wait
      const embed = new Discord.MessageEmbed({
        title: "Please wait before claiming again",
        description: message.author.username + ", you need to wait `" +
          differenceHour.getMinutes() + "` minutes and `" +
          differenceHour.getSeconds() + "` seconds before claiming again.",
        color: "#ff0000"
      });

      message.channel.send(embed);
    } else {
      user!.currency += claimCurrency;
      user!.lastClaimedDaily = new Date();
      user!.save();

      const embed = new Discord.MessageEmbed({
        title: "Birbcoins claimed!",
        description: message.author.username + " claimed `" + claimCurrency + "` birbcoins! They now have `" + user!.currency + "` birbcoins.",
        color: "#17d9ff"
      });

      message.channel.send(embed);
    }
  }
};

export default claimCommand;
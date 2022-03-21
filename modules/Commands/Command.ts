import { Client, CommandInteraction, Formatters, Interaction, Permissions } from 'discord.js';
import type { allowPayload, Command as ICommand, CommandPayload } from '../../types/Command';
import type { Message as IMessage } from '../../types/Message';
import devs from '../../data/JSON/dev.json';

interface Command extends ICommand { };

class Command {
    constructor(options: CommandPayload) {
        this.name = options.name;
        this.aliases = options.aliases ? options.aliases : [];
        this.description = options.description ? options.description : 'not provided';
        this.cooldown = options.cooldown ? options.cooldown : 0;
        this.expectedArgs = options.expectedArgs ? options.expectedArgs : 'not provided';
        this.dev = options.dev ? options.dev : false;
        this.guildOnly = options.guildOnly ? options.guildOnly : true;

        this.configBotPermissions(options.required);
        this.configUserPermissions(options.allow);
    }

    checkIfDev(message: IMessage | CommandInteraction) {
        return devs.includes(message instanceof Interaction ? message.member.user.id : message.author.id);
    }

    checkBotPermission(message: IMessage | CommandInteraction) {
        for (let i = 0; i < this.required.length; i++) {
            if (!message.guild.me.permissions.has(this.required[i]))
                return false;
        }
        return true;
    }

    configBotPermissions(permissionArray: bigint[] | undefined) {
        this.required = permissionArray ? permissionArray : [];
    }

    configUserPermissions(permissionArray: allowPayload | undefined) {
        let permissions: ICommand["allow"];
        permissions = { permissions: [], roles: [], ids: [] };

        if (permissionArray) {
            permissionArray.permissions && (permissions.permissions = permissionArray.permissions);
            permissionArray.ids && (permissions.ids = permissionArray.ids);
            permissionArray.roles && (permissions.roles = permissionArray.roles);
        }

        this.allow = permissions;
    }
}

export default Command;
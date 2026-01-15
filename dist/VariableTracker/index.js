var __webpack_modules__ = {
  "./src/VariableTracker/command.ts": 
  /*!****************************************!*\
  !*** ./src/VariableTracker/command.ts ***!
  \****************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      AddMapCommand: () => AddMapCommand,
      Command: () => Command,
      Commands: () => Commands,
      DeleteCommand: () => DeleteCommand,
      DeleteMapCommand: () => DeleteMapCommand,
      DeltaDatetimeCommand: () => DeltaDatetimeCommand,
      DeltaDatetimeSingleArgCommand: () => DeltaDatetimeSingleArgCommand,
      DeltaHighCommand: () => DeltaHighCommand,
      DeltaLowCommand: () => DeltaLowCommand,
      DeltaNumCommand: () => DeltaNumCommand,
      InitDatetimeCommand: () => InitDatetimeCommand,
      InitMapCommand: () => InitMapCommand,
      InitNumCommand: () => InitNumCommand,
      InitRandomCommand: () => InitRandomCommand,
      InitStrCommand: () => InitStrCommand,
      PopMapCommand: () => PopMapCommand,
      PostCommand: () => PostCommand,
      RollCommand: () => RollCommand,
      SetStrCommand: () => SetStrCommand
    });
    var _util_class_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/util/class_registry */ "./src/util/class_registry.ts");
    var _variable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variable */ "./src/VariableTracker/variable.ts");
    var __decorate = undefined && undefined.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = undefined && undefined.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var InitNumCommand_1, DeltaNumCommand_1, DeltaLowCommand_1, DeltaHighCommand_1, InitStrCommand_1, SetStrCommand_1, InitDatetimeCommand_1, DeltaDatetimeCommand_1, DeltaDatetimeSingleArgCommand_1, InitRandomCommand_1, RollCommand_1, DeleteCommand_1, InitMapCommand_1, AddMapCommand_1, PopMapCommand_1, DeleteMapCommand_1;
    class Command {
      static registry=new _util_class_registry__WEBPACK_IMPORTED_MODULE_0__.ClassRegistry;
      constructor(..._args) {}
      static parseString(s) {
        if (s === undefined) return [];
        const matches = [ ...s.matchAll(this.prototype.REGEX) ];
        return matches.map(match => ({
          command: this.prototype.create(match.slice(1).map(arg => arg.trim())),
          index: match.index
        })).filter(({command}) => command.isValid());
      }
    }
    class PostCommand extends Command {}
    let InitNumCommand = InitNumCommand_1 = class InitNumCommand extends Command {
      key;
      low;
      high;
      num;
      constructor(key, low, high, num) {
        super();
        this.key = key;
        this.low = low;
        this.high = high;
        this.num = num;
      }
      get REGEX() {
        return /init_num\s*\(\s*([^(),:]+?)\s*,\s*([^(),:]+?)\s*,\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const low = args[1] === "null" ? null : Number(args[1]);
        const high = args[2] === "null" ? null : Number(args[2]);
        const num = Number(args[3]);
        return new InitNumCommand_1(key, low, high, num);
      }
      isValid() {
        if (this.low !== null && isNaN(this.low)) return false;
        if (this.high !== null && isNaN(this.high)) return false;
        if (isNaN(this.num)) return false;
        if (this.low !== null && this.high !== null && this.low > this.high) return false;
        return true;
      }
      execute(state) {
        const variable = new _variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable(this.low, this.high, this.num);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    InitNumCommand = InitNumCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, Object, Object, Number ]) ], InitNumCommand);
    let DeltaNumCommand = DeltaNumCommand_1 = class DeltaNumCommand extends Command {
      key;
      delta;
      constructor(key, delta) {
        super();
        this.key = key;
        this.delta = delta;
      }
      get REGEX() {
        return /delta_num\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const delta = Number(args[1]);
        return new DeltaNumCommand_1(key, delta);
      }
      isValid() {
        if (isNaN(this.delta)) return false;
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable === false) return state;
        variable.deltaNum(this.delta);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    DeltaNumCommand = DeltaNumCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, Number ]) ], DeltaNumCommand);
    let DeltaLowCommand = DeltaLowCommand_1 = class DeltaLowCommand extends Command {
      key;
      delta;
      constructor(key, delta) {
        super();
        this.key = key;
        this.delta = delta;
      }
      get REGEX() {
        return /delta_low\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const delta = args[1] === "null" ? null : Number(args[1]);
        return new DeltaLowCommand_1(key, delta);
      }
      isValid() {
        if (this.delta !== null && isNaN(this.delta)) return false;
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable === false) return state;
        variable.deltaLow(this.delta);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    DeltaLowCommand = DeltaLowCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, Object ]) ], DeltaLowCommand);
    let DeltaHighCommand = DeltaHighCommand_1 = class DeltaHighCommand extends Command {
      key;
      delta;
      constructor(key, delta) {
        super();
        this.key = key;
        this.delta = delta;
      }
      get REGEX() {
        return /delta_high\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const delta = args[1] === "null" ? null : Number(args[1]);
        return new DeltaHighCommand_1(key, delta);
      }
      isValid() {
        if (this.delta !== null && isNaN(this.delta)) return false;
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable === false) return state;
        variable.deltaHigh(this.delta);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    DeltaHighCommand = DeltaHighCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, Object ]) ], DeltaHighCommand);
    let InitStrCommand = InitStrCommand_1 = class InitStrCommand extends Command {
      key;
      str;
      constructor(key, str) {
        super();
        this.key = key;
        this.str = str;
      }
      get REGEX() {
        return /init_str\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const str = args[1];
        return new InitStrCommand_1(key, str);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const variable = new _variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable(this.str);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    InitStrCommand = InitStrCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], InitStrCommand);
    let SetStrCommand = SetStrCommand_1 = class SetStrCommand extends Command {
      key;
      str;
      constructor(key, str) {
        super();
        this.key = key;
        this.str = str;
      }
      get REGEX() {
        return /set_str\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const str = args[1];
        return new SetStrCommand_1(key, str);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable === false) return state;
        variable.setStr(this.str);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    SetStrCommand = SetStrCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], SetStrCommand);
    let InitDatetimeCommand = InitDatetimeCommand_1 = class InitDatetimeCommand extends Command {
      key;
      datetime_string;
      constructor(key, datetime_string) {
        super();
        this.key = key;
        this.datetime_string = datetime_string;
      }
      get REGEX() {
        return /init_datetime\(([^,:]+),\s*([^)]+)\)/g;
      }
      create(args) {
        const key = args[0];
        const datetime_string = args[1];
        return new InitDatetimeCommand_1(key, datetime_string);
      }
      isValid() {
        const datetime = new Date(this.datetime_string);
        return !isNaN(datetime.getTime());
      }
      execute(state) {
        const datetime = new Date(this.datetime_string);
        const variable = new _variable__WEBPACK_IMPORTED_MODULE_1__.DatetimeVariable(datetime);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    InitDatetimeCommand = InitDatetimeCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], InitDatetimeCommand);
    let DeltaDatetimeCommand = DeltaDatetimeCommand_1 = class DeltaDatetimeCommand extends Command {
      key;
      delta_year;
      delta_month;
      delta_date;
      delta_hour;
      delta_minute;
      delta_second;
      constructor(key, delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second) {
        super();
        this.key = key;
        this.delta_year = delta_year;
        this.delta_month = delta_month;
        this.delta_date = delta_date;
        this.delta_hour = delta_hour;
        this.delta_minute = delta_minute;
        this.delta_second = delta_second;
      }
      get REGEX() {
        return /delta_datetime\(([^,]+),\s*([^)]+),\s*([^)]+),\s*([^)]+),\s*([^)]+),\s*([^)]+),\s*([^)]+)\)/g;
      }
      create(args) {
        const key = args[0];
        const delta_year = Number(args[1]);
        const delta_month = Number(args[2]);
        const delta_date = Number(args[3]);
        const delta_hour = Number(args[4]);
        const delta_minute = Number(args[5]);
        const delta_second = Number(args[6]);
        return new DeltaDatetimeCommand_1(key, delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second);
      }
      isValid() {
        if (isNaN(this.delta_year)) return false;
        if (isNaN(this.delta_month)) return false;
        if (isNaN(this.delta_date)) return false;
        if (isNaN(this.delta_hour)) return false;
        if (isNaN(this.delta_minute)) return false;
        if (isNaN(this.delta_second)) return false;
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.DatetimeVariable === false) return state;
        variable.deltaDatetime(this.delta_year, this.delta_month, this.delta_date, this.delta_hour, this.delta_minute, this.delta_second);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    DeltaDatetimeCommand = DeltaDatetimeCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, Number, Number, Number, Number, Number, Number ]) ], DeltaDatetimeCommand);
    let DeltaDatetimeSingleArgCommand = DeltaDatetimeSingleArgCommand_1 = class DeltaDatetimeSingleArgCommand extends Command {
      command_name;
      key;
      delta;
      constructor(command_name, key, delta) {
        super();
        this.command_name = command_name;
        this.key = key;
        this.delta = delta;
      }
      get REGEX() {
        return /(delta_year|delta_month|delta_date|delta_hour|delta_minute|delta_second)\(([^,]+),\s*([^)]+)\)/g;
      }
      create(args) {
        const command_name = args[0];
        const key = args[1];
        const delta = Number(args[2]);
        return new DeltaDatetimeSingleArgCommand_1(command_name, key, delta);
      }
      isValid() {
        if (isNaN(this.delta)) return false;
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.DatetimeVariable === false) return state;
        const delta_year = this.command_name === "delta_year" ? this.delta : 0;
        const delta_month = this.command_name === "delta_month" ? this.delta : 0;
        const delta_date = this.command_name === "delta_date" ? this.delta : 0;
        const delta_hour = this.command_name === "delta_hour" ? this.delta : 0;
        const delta_minute = this.command_name === "delta_minute" ? this.delta : 0;
        const delta_second = this.command_name === "delta_second" ? this.delta : 0;
        variable.deltaDatetime(delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    DeltaDatetimeSingleArgCommand = DeltaDatetimeSingleArgCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String, Number ]) ], DeltaDatetimeSingleArgCommand);
    let InitRandomCommand = InitRandomCommand_1 = class InitRandomCommand extends Command {
      key;
      random_events;
      constructor(key, random_events) {
        super();
        this.key = key;
        this.random_events = random_events;
      }
      get REGEX() {
        return /init_random\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        const random_events_str = args[1];
        const random_events = [];
        for (const random_event_str of random_events_str.split(",")) {
          const [event_str, weighting_str] = random_event_str.split(":");
          random_events.push({
            event: event_str,
            weighting: Number(weighting_str)
          });
        }
        return new InitRandomCommand_1(key, random_events);
      }
      isValid() {
        for (const random_event of this.random_events) {
          if (Number.isNaN(random_event.weighting)) return false;
        }
        return true;
      }
      execute(state) {
        const variable = new _variable__WEBPACK_IMPORTED_MODULE_1__.RandomVariable(null, this.random_events);
        state.setVariable(this.key, variable);
        return state;
      }
    };
    InitRandomCommand = InitRandomCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, Array ]) ], InitRandomCommand);
    let RollCommand = RollCommand_1 = class RollCommand extends PostCommand {
      key;
      constructor(key) {
        super();
        this.key = key;
      }
      get REGEX() {
        return /roll\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        return new RollCommand_1(key);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const variable = state.getVariable(this.key);
        if (variable === null || variable instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.RandomVariable === false) return state;
        variable.roll();
        state.setVariable(this.key, variable);
        return state;
      }
      getRestoreKeys(_state) {
        return [ this.key ];
      }
    };
    RollCommand = RollCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], RollCommand);
    let DeleteCommand = DeleteCommand_1 = class DeleteCommand extends Command {
      key;
      constructor(key) {
        super();
        this.key = key;
      }
      get REGEX() {
        return /delete\(([^,()]+)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        return new DeleteCommand_1(key);
      }
      isValid() {
        return true;
      }
      execute(state) {
        state.deleteVariable(this.key);
        return state;
      }
    };
    DeleteCommand = DeleteCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], DeleteCommand);
    let InitMapCommand = InitMapCommand_1 = class InitMapCommand extends Command {
      key;
      constructor(key) {
        super();
        this.key = key;
      }
      get REGEX() {
        return /init_map\(\s*([^,]+)\s*\)/g;
      }
      create(args) {
        const key = args[0];
        return new InitMapCommand_1(key);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const variable = new _variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable;
        state.setVariable(this.key, variable);
        return state;
      }
    };
    InitMapCommand = InitMapCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], InitMapCommand);
    let AddMapCommand = AddMapCommand_1 = class AddMapCommand extends Command {
      map_key;
      variable_key;
      constructor(map_key, variable_key) {
        super();
        this.map_key = map_key;
        this.variable_key = variable_key;
      }
      get REGEX() {
        return /add_map\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const map_key = args[0];
        const variable_key = args[1];
        return new AddMapCommand_1(map_key, variable_key);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const map = state.getVariable(this.map_key);
        if (map === null || map instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable === false) return state;
        const variable = state.getVariable(this.variable_key);
        if (variable === null) return state;
        map.setVariable(this.variable_key, variable);
        state.deleteVariable(this.variable_key);
        state.setVariable(this.map_key, map);
        return state;
      }
    };
    AddMapCommand = AddMapCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], AddMapCommand);
    let PopMapCommand = PopMapCommand_1 = class PopMapCommand extends Command {
      map_key;
      variable_key;
      constructor(map_key, variable_key) {
        super();
        this.map_key = map_key;
        this.variable_key = variable_key;
      }
      get REGEX() {
        return /pop_map\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const map_key = args[0];
        const variable_key = args[1];
        return new PopMapCommand_1(map_key, variable_key);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const map = state.getVariable(this.map_key);
        if (map === null || map instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable === false) return state;
        const variable = map.getVariable(this.variable_key);
        if (variable === undefined) return state;
        map.deleteVariable(this.variable_key);
        state.setVariable(this.variable_key, variable);
        state.setVariable(this.map_key, map);
        return state;
      }
    };
    PopMapCommand = PopMapCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], PopMapCommand);
    let DeleteMapCommand = DeleteMapCommand_1 = class DeleteMapCommand extends Command {
      map_key;
      variable_key;
      constructor(map_key, variable_key) {
        super();
        this.map_key = map_key;
        this.variable_key = variable_key;
      }
      get REGEX() {
        return /delete_map\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const map_key = args[0];
        const variable_key = args[1];
        return new DeleteMapCommand_1(map_key, variable_key);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const map = state.getVariable(this.map_key);
        if (map === null || map instanceof _variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable === false) return state;
        map.deleteVariable(this.variable_key);
        state.setVariable(this.map_key, map);
        return state;
      }
    };
    DeleteMapCommand = DeleteMapCommand_1 = __decorate([ Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], DeleteMapCommand);
    class Commands {
      commands=[];
      constructor(commands) {
        this.commands = commands ?? [];
      }
      pushCommand(command) {
        this.commands.push(command);
      }
      static fromString(s, mode = "normal") {
        let s_split = s.split("<UserPerspective>");
        if (!s.includes("<VTC>")) return new Commands;
        s_split = s_split[s_split.length - 1].split(`<VTC>`);
        const command_string = s_split[s_split.length - 1].split(`</VTC>`)[0];
        let command_index_array = [];
        for (const command_class of Command.registry.getAll().values()) {
          if (mode === "normal" && command_class.prototype instanceof PostCommand) continue;
          if (mode === "post" && !(command_class.prototype instanceof PostCommand)) continue;
          command_index_array = command_index_array.concat(command_class.parseString(command_string));
        }
        command_index_array.sort((a, b) => a.index - b.index);
        const commands = command_index_array.map(args => args.command);
        console.log("[VariableTracker] commands:", commands);
        return new Commands(commands);
      }
      execute(state) {
        for (const command of this.commands) {
          command.execute(state);
        }
        return state;
      }
      * [Symbol.iterator]() {
        for (const command of this.commands) {
          yield command;
        }
      }
    }
  },
  "./src/VariableTracker/event_listener.ts": 
  /*!***********************************************!*\
  !*** ./src/VariableTracker/event_listener.ts ***!
  \***********************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      getCurrentState: () => getCurrentState,
      setCurrentState: () => setCurrentState
    });
    var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
    var lodash__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
    var _command__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./command */ "./src/VariableTracker/command.ts");
    var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "./src/VariableTracker/state.ts");
    const VARIABLE_SCOPE = {
      type: "chat"
    };
    function calculateMessageId(message_id) {
      if (message_id < 0) message_id = getLastMessageId() + message_id + 1;
      return message_id;
    }
    function getCurrentState() {
      const variables = getVariables(VARIABLE_SCOPE);
      const current = variables["current"] ?? null;
      return _state__WEBPACK_IMPORTED_MODULE_2__.State.fromVariables(current);
    }
    function setCurrentState(state) {
      const variables = getVariables(VARIABLE_SCOPE);
      variables["current"] = state.toVariables();
      replaceVariables(variables, VARIABLE_SCOPE);
    }
    function emptyCurrentState() {
      const variables = getVariables(VARIABLE_SCOPE);
      variables["current"] = {};
      replaceVariables(variables, VARIABLE_SCOPE);
    }
    function setCurrentStateToPrev(message_id) {
      if (message_id === 0) {
        emptyCurrentState();
      } else {
        const prev_message_id = message_id - 1;
        const prev_swipe_id = getSwipeId(prev_message_id);
        setCurrentState(getHistory(prev_message_id, prev_swipe_id));
      }
    }
    function getHistory(message_id, swipe_id) {
      message_id = calculateMessageId(message_id);
      const variables = getVariables(VARIABLE_SCOPE);
      return _state__WEBPACK_IMPORTED_MODULE_2__.State.fromVariables(variables["history"][message_id][swipe_id]);
    }
    function setHistory(state, message_id = -1, swipe_id) {
      message_id = calculateMessageId(message_id);
      const variables = getVariables(VARIABLE_SCOPE);
      variables["history"] = variables["history"] ?? [];
      variables["history"][message_id] = variables["history"][message_id] ?? [];
      variables["history"][message_id][swipe_id] = state.toVariables();
      replaceVariables(variables, VARIABLE_SCOPE);
    }
    function deleteHistory(message_id, swipe_id) {
      const variable = getVariables(VARIABLE_SCOPE);
      if (!variable.history) return;
      variable["history"][message_id].splice(swipe_id, 1);
      replaceVariables(variable, VARIABLE_SCOPE);
    }
    function deleteHistoryStartFrom(start_message_id) {
      const variables = getVariables(VARIABLE_SCOPE);
      if (!variables.history) return;
      variables.history.splice(start_message_id);
      replaceVariables(variables, VARIABLE_SCOPE);
    }
    function getHistorySize(message_id) {
      message_id = calculateMessageId(message_id);
      const variables = getVariables(VARIABLE_SCOPE);
      return variables["history"][message_id].length;
    }
    function getSwipeId(message_id) {
      return getChatMessages(message_id, {
        include_swipes: true
      })[0].swipe_id;
    }
    function isSwipeExist(message_id, swipe_id) {
      const chat_message = getChatMessages(message_id, {
        include_swipes: true
      })[0];
      return swipe_id < chat_message.swipes.length;
    }
    function getNumOfSwipe(message_id) {
      return getChatMessages(message_id, {
        include_swipes: true
      })[0].swipes.length;
    }
    function executeCommand(message_id, swipe_id) {
      console.log("[VariableTracker] executeCommand strat");
      let message;
      if (swipe_id === undefined) {
        message = getChatMessages(message_id)[0].message;
      } else {
        message = getChatMessages(message_id, {
          include_swipes: true
        })[0].swipes[swipe_id];
      }
      const commands = _command__WEBPACK_IMPORTED_MODULE_1__.Commands.fromString(message);
      console.log("[VariableTracker] commands:", commands);
      const state = getCurrentState();
      commands.execute(state);
      console.log("[VariableTracker] state:", state);
      setCurrentState(state);
      console.log("[VariableTracker] executeCommand end");
    }
    function executePostCommand(message_id, swipe_id) {
      console.log("[VariableTracker] executePostCommand strat");
      let message;
      if (swipe_id === undefined) {
        message = getChatMessages(message_id)[0].message;
      } else {
        message = getChatMessages(message_id, {
          include_swipes: true
        })[0].swipes[swipe_id];
      }
      const commands = _command__WEBPACK_IMPORTED_MODULE_1__.Commands.fromString(message, "post");
      console.log("[VariableTracker] post commands:", commands);
      const state = getCurrentState();
      commands.execute(state);
      console.log("[VariableTracker] state:", state);
      setCurrentState(state);
      console.log("[VariableTracker] executePostCommand end");
    }
    function restorePostCommandResultFromNextMessage(message_id, swipe_id) {
      if (!swipe_id) swipe_id = getSwipeId(message_id);
      const message = getChatMessages(message_id, {
        include_swipes: true
      })[0].swipes[swipe_id];
      const commands = _command__WEBPACK_IMPORTED_MODULE_1__.Commands.fromString(message, "post");
      const state = getHistory(message_id, swipe_id);
      const next_message_id = message_id + 1;
      const next_swipe_id = getSwipeId(next_message_id);
      const next_state = getHistory(next_message_id, next_swipe_id);
      for (const command of commands) {
        const post_command = command;
        for (const restore_key of post_command.getRestoreKeys(state)) {
          const variable = next_state.getVariable(restore_key);
          if (variable) state.setVariable(restore_key, variable);
        }
      }
      setHistory(state, message_id, swipe_id);
    }
    function restorePostCommandResultFromHistory(message_id, swipe_id) {
      const current_message = getChatMessages(message_id, {
        include_swipes: true
      })[0].swipes[swipe_id];
      const commands = _command__WEBPACK_IMPORTED_MODULE_1__.Commands.fromString(current_message, "post");
      if (message_id !== 0) {
        const prev_message_id = message_id - 1;
        const prev_swipe_id = getSwipeId(prev_message_id);
        const prev_message = getChatMessages(prev_message_id, {
          include_swipes: true
        })[0].swipes[prev_swipe_id];
        const prev_commands = _command__WEBPACK_IMPORTED_MODULE_1__.Commands.fromString(prev_message, "post");
        for (const prev_command of prev_commands) {
          commands.pushCommand(prev_command);
        }
        const current_state = getCurrentState();
        const history_state = getHistory(message_id, swipe_id);
        for (const command of commands) {
          const post_command = command;
          for (const restore_key of post_command.getRestoreKeys(current_state)) {
            const variable = history_state.getVariable(restore_key);
            if (variable) current_state.setVariable(restore_key, variable);
          }
        }
        setCurrentState(current_state);
      }
    }
    function reprocessMessageFrom(start_message_id) {
      setCurrentStateToPrev(start_message_id);
      for (let message_id = start_message_id; message_id <= getLastMessageId(); message_id++) {
        console.log("[DEBUG] message_id:", message_id);
        for (let swipe_id = 0; swipe_id < getNumOfSwipe(message_id); swipe_id++) {
          executeCommand(message_id, swipe_id);
          setHistory(getCurrentState(), message_id, swipe_id);
          setCurrentStateToPrev(message_id);
        }
        setCurrentState(getHistory(message_id, getSwipeId(message_id)));
      }
    }
    eventOn(tavern_events.MESSAGE_SENT, async message_id => {
      console.log("[VariableTracker] MESSAGE_SENT strat");
      executeCommand(message_id);
      executePostCommand(message_id);
      const swipe_id = getSwipeId(message_id);
      setHistory(getCurrentState(), message_id, swipe_id);
      console.log("[VariableTracker] MESSAGE_SENT end");
    });
    eventOn(tavern_events.MESSAGE_UPDATED, async message_id => {
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log("[VariableTracker] MESSAGE_UPDATED strat");
      message_id = Number(message_id);
      const num_swipe = getNumOfSwipe(message_id);
      const num_history = getHistorySize(message_id);
      if (num_swipe < num_history) {
        const swipe_id = getSwipeId(message_id);
        deleteHistory(message_id, swipe_id);
      }
      setCurrentStateToPrev(message_id);
      reprocessMessageFrom(message_id);
      if (message_id !== 0) {
        restorePostCommandResultFromNextMessage(message_id - 1);
      }
      console.log("[VariableTracker] MESSAGE_UPDATED end");
    });
    eventOn(tavern_events.MESSAGE_RECEIVED, async message_id => {
      console.log("[VariableTracker] MESSAGE_RECEIVED strat");
      executeCommand(message_id);
      executePostCommand(message_id);
      const swipe_id = getSwipeId(message_id);
      setHistory(getCurrentState(), message_id, swipe_id);
      console.log("[VariableTracker] MESSAGE_RECEIVED end");
    });
    eventOn(tavern_events.MESSAGE_SWIPED, async message_id => {
      console.log("[VariableTracker] MESSAGE_SWIPED strat");
      const swipe_id = getSwipeId(message_id);
      const prev_message_id = message_id === 0 ? null : message_id - 1;
      if (isSwipeExist(message_id, swipe_id)) {
        setCurrentState(getHistory(message_id, swipe_id));
        if (prev_message_id !== null) {
          restorePostCommandResultFromNextMessage(prev_message_id);
        }
      } else if (prev_message_id !== null) {
        setCurrentStateToPrev(prev_message_id);
        if (prev_message_id !== 0) {
          executeCommand(prev_message_id - 1);
          executePostCommand(prev_message_id - 1);
        }
        const prev_swipe_id = getSwipeId(prev_message_id);
        executePostCommand(prev_message_id);
        setHistory(getCurrentState(), prev_message_id, prev_swipe_id);
      } else {
        emptyCurrentState();
      }
      console.log("[VariableTracker] MESSAGE_SWIPED end");
    });
    eventOn(tavern_events.MESSAGE_DELETED, async _message_id => {
      console.log("[VariableTracker] MESSAGE_DELETED strat");
      const chat_messages = getChatMessages("0-{{lastMessageId}}", {
        include_swipes: true
      });
      let prefer_role, deleted_message_id;
      if (getCharData("current")?.first_mes) prefer_role = "assistant"; else prefer_role = "user";
      for (const chat_message of chat_messages) {
        if (chat_message.role === prefer_role) {
          if (prefer_role === "assistant") prefer_role = "user"; else prefer_role = "assistant";
        } else {
          deleted_message_id = chat_message.message_id;
          break;
        }
      }
      if (!deleted_message_id) deleted_message_id = chat_messages.length;
      setCurrentStateToPrev(deleted_message_id);
      deleteHistoryStartFrom(deleted_message_id);
      deleteChatMessages(lodash__WEBPACK_IMPORTED_MODULE_0___default().range(deleted_message_id, getLastMessageId() + 1));
      console.log("[VariableTracker] MESSAGE_DELETED end");
    });
    function clearAllVariables() {
      toastr.info("開始清除所有變數...", "VariableTracker Debug");
      const variables = getVariables(VARIABLE_SCOPE);
      variables.current = {};
      variables.history = [];
      replaceVariables(variables, VARIABLE_SCOPE);
      toastr.success("所有變數已清除！", "VariableTracker Debug");
    }
    async function reloadAllVariables() {
      toastr.info("開始重新讀取所有變數...", "VariableTracker Debug");
      try {
        deleteHistoryStartFrom(0);
        reprocessMessageFrom(0);
      } catch (error) {
        console.error("[VariableTracker] 重新讀取變數時發生錯誤:", error);
        toastr.error("重新讀取變數失敗，請檢查控制台日誌", "VariableTracker Debug");
        return;
      }
      toastr.success("所有變數已重新讀取完成！", "VariableTracker Debug");
    }
    eventOn(getButtonEvent("清除所有變數"), clearAllVariables);
    eventOn(getButtonEvent("重新讀取所有變數"), reloadAllVariables);
  },
  "./src/VariableTracker/state.ts": 
  /*!**************************************!*\
  !*** ./src/VariableTracker/state.ts ***!
  \**************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      State: () => State
    });
    var _variable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./variable */ "./src/VariableTracker/variable.ts");
    class State {
      state;
      constructor(state) {
        if (state) this.state = state.state; else this.state = new Map;
      }
      static fromVariables(variables) {
        const state = new State;
        if (variables === null) return state;
        for (const [key, variable_record] of Object.entries(variables)) {
          const variable = _variable__WEBPACK_IMPORTED_MODULE_0__.Variable.registry.get(variable_record.type)?.fromObject(variable_record.values);
          if (variable) state.setVariable(key, variable);
        }
        return state;
      }
      toVariables() {
        const variables = {};
        for (const [key, variable] of this.state) {
          variables[key] = {
            type: variable.TYPE,
            values: variable.getValue()
          };
        }
        return variables;
      }
      getVariable(key) {
        return this.state.get(key) ?? null;
      }
      setVariable(key, variable) {
        this.state.set(key, variable);
      }
      deleteVariable(key) {
        this.state.delete(key);
      }
    }
  },
  "./src/VariableTracker/variable.ts": 
  /*!*****************************************!*\
  !*** ./src/VariableTracker/variable.ts ***!
  \*****************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      DatetimeVariable: () => DatetimeVariable,
      MapVariable: () => MapVariable,
      NumVariable: () => NumVariable,
      RandomVariable: () => RandomVariable,
      StrVariable: () => StrVariable,
      Variable: () => Variable
    });
    var _util_class_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/util/class_registry */ "./src/util/class_registry.ts");
    var _util_random__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/util/random */ "./src/util/random.ts");
    var __decorate = undefined && undefined.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = undefined && undefined.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var NumVariable_1, StrVariable_1, DatetimeVariable_1, RandomVariable_1, MapVariable_1;
    var _a, _b;
    class Variable {
      static registry=new _util_class_registry__WEBPACK_IMPORTED_MODULE_0__.ClassRegistry;
      constructor(..._args) {}
      static fromObject(obj) {
        return this.prototype.fromObject(obj);
      }
    }
    let NumVariable = NumVariable_1 = class NumVariable extends Variable {
      low;
      high;
      num;
      constructor(low, high, num) {
        super();
        this.low = low;
        this.high = high;
        this.num = num;
      }
      fromObject(obj) {
        const low = obj["low"];
        const high = obj["high"];
        const num = obj["num"];
        return new NumVariable_1(low, high, num);
      }
      get TYPE() {
        return "num";
      }
      getValue() {
        return {
          low: this.low,
          high: this.high,
          num: this.num
        };
      }
      getLow() {
        return this.low;
      }
      getHigh() {
        return this.high;
      }
      getNum() {
        return this.num;
      }
      deltaLow(delta) {
        if (delta === null) {
          this.low = null;
        } else if (this.low === null) {
          this.low = delta;
        } else {
          this.low += delta;
        }
        this.applyConstrain();
      }
      deltaHigh(delta) {
        if (delta === null) {
          this.high = null;
        } else if (this.high === null) {
          this.high = delta;
        } else {
          this.high += delta;
        }
        this.applyConstrain();
      }
      deltaNum(delta) {
        this.num += delta;
        this.applyConstrain();
      }
      applyConstrain() {
        if (this.low !== null && this.num < this.low) {
          this.num = this.low;
        }
        if (this.high !== null && this.num > this.high) {
          this.num = this.high;
        }
      }
    };
    NumVariable = NumVariable_1 = __decorate([ Variable.registry.register(NumVariable.prototype.TYPE), __metadata("design:paramtypes", [ Object, Object, Number ]) ], NumVariable);
    let StrVariable = StrVariable_1 = class StrVariable extends Variable {
      str;
      constructor(str) {
        super();
        this.str = str;
      }
      fromObject(obj) {
        const str = obj["str"];
        return new StrVariable_1(str);
      }
      get TYPE() {
        return "str";
      }
      getValue() {
        return {
          str: this.str
        };
      }
      getStr() {
        return this.str;
      }
      setStr(str) {
        this.str = str;
      }
    };
    StrVariable = StrVariable_1 = __decorate([ Variable.registry.register(StrVariable.prototype.TYPE), __metadata("design:paramtypes", [ String ]) ], StrVariable);
    let DatetimeVariable = DatetimeVariable_1 = class DatetimeVariable extends Variable {
      datetime;
      constructor(datetime) {
        super();
        this.datetime = new Date(datetime);
      }
      fromObject(obj) {
        const datetime = obj["datetime"];
        return new DatetimeVariable_1(datetime);
      }
      get TYPE() {
        return "datetime";
      }
      getValue() {
        return {
          datetime: this.datetime
        };
      }
      getYear() {
        return this.datetime.getFullYear();
      }
      getMonth() {
        return this.datetime.getMonth();
      }
      getDate() {
        return this.datetime.getDate();
      }
      getHours() {
        return this.datetime.getHours();
      }
      getMinutes() {
        return this.datetime.getMinutes();
      }
      getSeconds() {
        return this.datetime.getSeconds();
      }
      getDay() {
        return this.datetime.getDay();
      }
      getDateTime() {
        return this.datetime;
      }
      deltaDatetime(delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second) {
        this.datetime.setFullYear(this.datetime.getFullYear() + delta_year);
        this.datetime.setMonth(this.datetime.getMonth() + delta_month);
        this.datetime.setDate(this.datetime.getDate() + delta_date);
        this.datetime.setHours(this.datetime.getHours() + delta_hour);
        this.datetime.setMinutes(this.datetime.getMinutes() + delta_minute);
        this.datetime.setSeconds(this.datetime.getSeconds() + delta_second);
      }
    };
    DatetimeVariable = DatetimeVariable_1 = __decorate([ Variable.registry.register(DatetimeVariable.prototype.TYPE), __metadata("design:paramtypes", [ typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object ]) ], DatetimeVariable);
    let RandomVariable = RandomVariable_1 = class RandomVariable extends Variable {
      outcome;
      random_events;
      constructor(outcome, random_events) {
        super();
        this.outcome = outcome;
        this.random_events = random_events;
      }
      fromObject(obj) {
        const outcome = obj?.outcome;
        const events = obj["random_events"];
        return new RandomVariable_1(outcome, events);
      }
      get TYPE() {
        return "random";
      }
      getValue() {
        return {
          outcome: this.outcome,
          random_events: this.random_events
        };
      }
      roll() {
        this.outcome = (0, _util_random__WEBPACK_IMPORTED_MODULE_1__.select)(this.random_events);
      }
    };
    RandomVariable = RandomVariable_1 = __decorate([ Variable.registry.register(RandomVariable.prototype.TYPE), __metadata("design:paramtypes", [ Object, Array ]) ], RandomVariable);
    let MapVariable = MapVariable_1 = class MapVariable extends Variable {
      map;
      constructor(map) {
        super();
        this.map = new Map;
        if (!map) return;
        for (const [key, variable_record] of Object.entries(map)) {
          const variable = Variable.registry.get(variable_record.type)?.fromObject(variable_record.values);
          if (variable) this.map.set(key, variable);
        }
      }
      get TYPE() {
        return "map";
      }
      fromObject(map) {
        return new MapVariable_1(map);
      }
      getValue() {
        const record = {};
        for (const [key, variable] of this.map.entries()) {
          record[key] = {
            type: variable.TYPE,
            values: variable.getValue()
          };
        }
        return record;
      }
      getVariable(key) {
        return this.map.get(key);
      }
      setVariable(key, variable) {
        this.map.set(key, variable);
      }
      deleteVariable(key) {
        this.map.delete(key);
      }
      get size() {
        return this.map.size;
      }
      keys() {
        return this.map.keys();
      }
    };
    MapVariable = MapVariable_1 = __decorate([ Variable.registry.register(MapVariable.prototype.TYPE), __metadata("design:paramtypes", [ typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object ]) ], MapVariable);
  },
  "./src/util/class_registry.ts": 
  /*!************************************!*\
  !*** ./src/util/class_registry.ts ***!
  \************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      ClassRegistry: () => ClassRegistry
    });
    class ClassRegistry {
      registry=new Map;
      register(key) {
        return cls => {
          if (!key) key = cls.name;
          this.registry.set(key, cls);
          return cls;
        };
      }
      get(key) {
        return this.registry.get(key);
      }
      getAll() {
        return this.registry;
      }
      has(key) {
        return this.registry.has(key);
      }
    }
  },
  "./src/util/random.ts": 
  /*!****************************!*\
  !*** ./src/util/random.ts ***!
  \****************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      select: () => select
    });
    function select(random_events) {
      let total_weight = 0;
      for (const random_event of random_events) {
        total_weight += random_event.weighting;
      }
      let random = Math.random() * total_weight;
      for (const random_event of random_events) {
        random -= random_event.weighting;
        if (random <= 0) return random_event.event;
      }
      return random_events[-1].event;
    }
  },
  lodash: 
  /*!********************!*\
  !*** external "_" ***!
  \********************/ module => {
    module.exports = _;
  }
};

var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

(() => {
  __webpack_require__.n = module => {
    var getter = module && module.__esModule ? () => module["default"] : () => module;
    __webpack_require__.d(getter, {
      a: getter
    });
    return getter;
  };
})();

(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key]
        });
      }
    }
  };
})();

(() => {
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();

(() => {
  __webpack_require__.r = exports => {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
})();

var __webpack_exports__ = {};

(() => {
  /*!**************************************!*\
  !*** ./src/VariableTracker/index.ts ***!
  \**************************************/
  __webpack_require__.r(__webpack_exports__);
  var _command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./command */ "./src/VariableTracker/command.ts");
  var _event_listener__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event_listener */ "./src/VariableTracker/event_listener.ts");
  var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "./src/VariableTracker/state.ts");
  var _variable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./variable */ "./src/VariableTracker/variable.ts");
})();
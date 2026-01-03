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
  "./src/util/registry.ts": 
  /*!******************************!*\
  !*** ./src/util/registry.ts ***!
  \******************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      Registry: () => Registry
    });
    class Registry {
      registry=new Map;
      register(key, value) {
        this.registry.set(key, value);
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
  "./src/黑白妹VT/action.ts": 
  /*!*****************************!*\
  !*** ./src/黑白妹VT/action.ts ***!
  \*****************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      Action: () => Action,
      BattlePuzzleGameAction: () => BattlePuzzleGameAction,
      BuyBentoAction: () => BuyBentoAction,
      BuyCookingIngredientsAction: () => BuyCookingIngredientsAction,
      BuyCupNoodleAction: () => BuyCupNoodleAction,
      BuyStaminaIngredientsAction: () => BuyStaminaIngredientsAction,
      CheerTalkAction: () => CheerTalkAction,
      DinnerAction: () => DinnerAction,
      FapOnBraAction: () => FapOnBraAction,
      FightingGameAction: () => FightingGameAction,
      HuntOfBraAction: () => HuntOfBraAction,
      LewdTalkAction: () => LewdTalkAction,
      MorningAction: () => MorningAction,
      NormalTalkAction: () => NormalTalkAction,
      RacingGameAction: () => RacingGameAction,
      RoleplayGameAction: () => RoleplayGameAction,
      SchoolAction: () => SchoolAction,
      SelfBuyMealAction: () => SelfBuyMealAction,
      SisterBathAction: () => SisterBathAction,
      SleepAction: () => SleepAction,
      UserBathAction: () => UserBathAction
    });
    var _util_class_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/util/class_registry */ "./src/util/class_registry.ts");
    var _game_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game_state */ "./src/黑白妹VT/game_state.ts");
    var __decorate = undefined && undefined.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var NormalTalkAction_1, LewdTalkAction_1, CheerTalkAction_1, BattlePuzzleGameAction_1, FightingGameAction_1, RacingGameAction_1, RoleplayGameAction_1, HuntOfBraAction_1, FapOnBraAction_1, SleepAction_1, MorningAction_1, SchoolAction_1, SelfBuyMealAction_1, DinnerAction_1;
    class Action {
      static registry=new _util_class_registry__WEBPACK_IMPORTED_MODULE_0__.ClassRegistry;
      static NONE_STR="無";
    }
    let NormalTalkAction = class NormalTalkAction extends Action {
      static {
        NormalTalkAction_1 = this;
      }
      static SUCCESS_STR="成功提高信賴";
      static NORMAL_STR="普通";
      get category() {
        return "說話";
      }
      get name() {
        return "無關緊要的話題";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-10);
        if (Math.random() < .33) game_state.setExpectResult(NormalTalkAction_1.SUCCESS_STR); else game_state.setExpectResult(NormalTalkAction_1.NORMAL_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY ];
      }
      finish(game_state) {
        switch (game_state.getExpectResult()) {
         case NormalTalkAction_1.SUCCESS_STR:
          game_state.deltaTrust(+4);
          break;

         case NormalTalkAction_1.NORMAL_STR:
          game_state.deltaTrust(+2);
          break;
        }
        game_state.deltaMinutes(+30);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 10) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    NormalTalkAction = NormalTalkAction_1 = __decorate([ Action.registry.register(NormalTalkAction.prototype.name) ], NormalTalkAction);
    let LewdTalkAction = class LewdTalkAction extends Action {
      static {
        LewdTalkAction_1 = this;
      }
      static SUCCESS_STR="成功，提高興致";
      static NORMAL_STR="普通";
      static FAIL_STR="失敗，降低信賴";
      get category() {
        return "說話";
      }
      get name() {
        return "色色的話題";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-15);
        const rand = Math.random();
        if (rand < .25) game_state.setExpectResult(LewdTalkAction_1.SUCCESS_STR); else if (rand < .5) game_state.setExpectResult(LewdTalkAction_1.FAIL_STR); else game_state.setExpectResult(LewdTalkAction_1.NORMAL_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY ];
      }
      finish(game_state) {
        let delta_trust = -1;
        let delta_interest = +2;
        switch (game_state.getExpectResult()) {
         case LewdTalkAction_1.SUCCESS_STR:
          delta_interest += 2;
          break;

         case LewdTalkAction_1.FAIL_STR:
          delta_trust -= 1;
          delta_interest -= 1;
          break;
        }
        game_state.deltaTrust(delta_trust);
        game_state.deltaInterest(delta_interest);
        game_state.deltaMinutes(+30);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INTEREST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 15) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    LewdTalkAction = LewdTalkAction_1 = __decorate([ Action.registry.register(LewdTalkAction.prototype.name) ], LewdTalkAction);
    let CheerTalkAction = class CheerTalkAction extends Action {
      static {
        CheerTalkAction_1 = this;
      }
      static SUCCESS_STR="成功，提高心情";
      get category() {
        return "說話";
      }
      get name() {
        return "討好";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-20);
        game_state.setExpectResult(CheerTalkAction_1.SUCCESS_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        if (game_state.getMood() <= 0) game_state.deltaMood(+1);
        game_state.deltaMinutes(+60);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 20) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    CheerTalkAction = CheerTalkAction_1 = __decorate([ Action.registry.register(CheerTalkAction.prototype.name) ], CheerTalkAction);
    let BattlePuzzleGameAction = class BattlePuzzleGameAction extends Action {
      static {
        BattlePuzzleGameAction_1 = this;
      }
      static SUCCESS_STR="成功，提高信賴、心情";
      static NORMAL_STR="普通";
      static FAIL_STR="失敗，降低心情";
      get category() {
        return "玩遊戲吧";
      }
      get name() {
        return "對戰遊戲";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-20);
        const rand = Math.random();
        if (rand < .3) game_state.setExpectResult(BattlePuzzleGameAction_1.SUCCESS_STR); else if (rand < .4) game_state.setExpectResult(BattlePuzzleGameAction_1.FAIL_STR); else game_state.setExpectResult(BattlePuzzleGameAction_1.NORMAL_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        let delta_trust = +5;
        let delta_mood = 0;
        switch (game_state.getExpectResult()) {
         case BattlePuzzleGameAction_1.SUCCESS_STR:
          delta_trust += 4;
          delta_mood += 1;
          break;

         case BattlePuzzleGameAction_1.FAIL_STR:
          delta_mood -= 1;
          break;
        }
        game_state.deltaMinutes(+120);
        game_state.deltaTrust(delta_trust);
        game_state.deltaMood(delta_mood);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 20) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    BattlePuzzleGameAction = BattlePuzzleGameAction_1 = __decorate([ Action.registry.register(BattlePuzzleGameAction.prototype.name) ], BattlePuzzleGameAction);
    let FightingGameAction = class FightingGameAction extends Action {
      static {
        FightingGameAction_1 = this;
      }
      static SUCCESS_STR="成功，提高信賴、心情";
      static NORMAL_STR="普通";
      static FAIL_STR="失敗，降低心情";
      get category() {
        return "玩遊戲吧";
      }
      get name() {
        return "格鬥遊戲";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-20);
        const rand = Math.random();
        if (rand < .5) game_state.setExpectResult(FightingGameAction_1.SUCCESS_STR); else if (rand < .8) game_state.setExpectResult(FightingGameAction_1.FAIL_STR); else game_state.setExpectResult(FightingGameAction_1.NORMAL_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        let delta_trust = +3;
        let delta_mood = 0;
        switch (game_state.getExpectResult()) {
         case FightingGameAction_1.SUCCESS_STR:
          delta_trust += 6;
          delta_mood += 1;
          break;

         case FightingGameAction_1.FAIL_STR:
          delta_mood -= 1;
          break;
        }
        game_state.deltaMinutes(+120);
        game_state.deltaTrust(delta_trust);
        game_state.deltaMood(delta_mood);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 20) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    FightingGameAction = FightingGameAction_1 = __decorate([ Action.registry.register(FightingGameAction.prototype.name) ], FightingGameAction);
    let RacingGameAction = class RacingGameAction extends Action {
      static {
        RacingGameAction_1 = this;
      }
      static SUCCESS_STR="成功，提高信賴、心情";
      static NORMAL_STR="普通";
      static FAIL_STR="失敗，降低信賴、心情";
      get category() {
        return "玩遊戲吧";
      }
      get name() {
        return "競速遊戲";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-20);
        const rand = Math.random();
        if (rand < .7) game_state.setExpectResult(RacingGameAction_1.SUCCESS_STR); else if (rand < .8) game_state.setExpectResult(RacingGameAction_1.FAIL_STR); else game_state.setExpectResult(RacingGameAction_1.NORMAL_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        let delta_trust = +2;
        let delta_mood = 0;
        switch (game_state.getExpectResult()) {
         case RacingGameAction_1.SUCCESS_STR:
          delta_trust += 2;
          delta_mood += 1;
          break;

         case RacingGameAction_1.FAIL_STR:
          delta_trust -= 3;
          delta_mood -= 1;
          break;
        }
        game_state.deltaMinutes(+120);
        game_state.deltaTrust(delta_trust);
        game_state.deltaMood(delta_mood);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 20) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    RacingGameAction = RacingGameAction_1 = __decorate([ Action.registry.register(RacingGameAction.prototype.name) ], RacingGameAction);
    let RoleplayGameAction = class RoleplayGameAction extends Action {
      static {
        RoleplayGameAction_1 = this;
      }
      static SUCCESS_STR="成功，提高信賴、心情";
      static NORMAL_STR="普通";
      static FAIL_STR="失敗，降低信賴、心情";
      get category() {
        return "玩遊戲吧";
      }
      get name() {
        return "角色扮演遊戲";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-20);
        const rand = Math.random();
        if (rand < .4) game_state.setExpectResult(RoleplayGameAction_1.SUCCESS_STR); else if (rand < .8) game_state.setExpectResult(RoleplayGameAction_1.FAIL_STR); else game_state.setExpectResult(RoleplayGameAction_1.NORMAL_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        let delta_trust = +3;
        let delta_mood = 0;
        switch (game_state.getExpectResult()) {
         case RoleplayGameAction_1.SUCCESS_STR:
          delta_trust += 10;
          delta_mood += 1;
          break;

         case RoleplayGameAction_1.FAIL_STR:
          delta_trust -= 2;
          delta_mood -= 1;
          break;
        }
        game_state.deltaMinutes(+120);
        game_state.deltaTrust(delta_trust);
        game_state.deltaMood(delta_mood);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.getStamina() < 20) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    RoleplayGameAction = RoleplayGameAction_1 = __decorate([ Action.registry.register(RoleplayGameAction.prototype.name) ], RoleplayGameAction);
    let UserBathAction = class UserBathAction extends Action {
      get category() {
        return "洗澡！";
      }
      get name() {
        return "哥哥一個人洗澡";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        game_state.setSmallPlace("浴室");
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY ];
      }
      finish(game_state) {
        game_state.deltaStamina(+15);
        game_state.deltaMinutes(+30);
        game_state.setFlagBath(true);
        game_state.setSmallPlace("客廳");
        game_state.setCurrentAction(SisterBathAction.prototype.name);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.FLAGS_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.isAlreadyBath()) return false;
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        return true;
      }
      isForce(game_state) {
        if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
        if (game_state.isAlreadyBath()) return false;
        if (!game_state.isCurrentDateTimeBetween(21, 0, 2, 0)) return false;
        return true;
      }
    };
    UserBathAction = __decorate([ Action.registry.register(UserBathAction.prototype.name) ], UserBathAction);
    let SisterBathAction = class SisterBathAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "妹妹一個人洗澡";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY ];
      }
      finish(game_state) {
        game_state.deltaMinutes(+30);
        game_state.setCurrentAction(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY ];
      }
      isPossible(_game_state) {
        return false;
      }
      isForce(_game_state) {
        return false;
      }
    };
    SisterBathAction = __decorate([ Action.registry.register(SisterBathAction.prototype.name) ], SisterBathAction);
    let HuntOfBraAction = class HuntOfBraAction extends Action {
      static {
        HuntOfBraAction_1 = this;
      }
      static SUCCESS_STR="沒有被妹妹察覺";
      static FAIL_STR="引起妹妹疑心，降低信賴";
      get category() {
        return null;
      }
      get name() {
        return "偷看妹妹換下來的胸罩";
      }
      start(game_state) {
        game_state.setSmallPlace("更衣間");
        game_state.setCurrentAction(this.name);
        game_state.deltaStamina(-10);
        const rand = Math.random();
        if (rand < .1) game_state.setExpectResult(HuntOfBraAction_1.FAIL_STR); else game_state.setExpectResult(HuntOfBraAction_1.SUCCESS_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        if (game_state.getExpectResult() === HuntOfBraAction_1.FAIL_STR) game_state.deltaTrust(-2);
        game_state.deltaMinutes(+30);
        game_state.setSmallPlace("客廳");
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== SisterBathAction.prototype.name) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    HuntOfBraAction = HuntOfBraAction_1 = __decorate([ Action.registry.register(HuntOfBraAction.prototype.name) ], HuntOfBraAction);
    let FapOnBraAction = class FapOnBraAction extends Action {
      static {
        FapOnBraAction_1 = this;
      }
      static SUCCESS_STR="成功在妹妹洗澡完畢前自慰至射精在妹妹的胸罩上，沒有被妹妹察覺";
      static FAIL_STR="被妹妹發現哥哥闖進更衣間，降低信賴、心情";
      get category() {
        return null;
      }
      get name() {
        return "拿妹妹的胸罩自慰";
      }
      start(game_state) {
        game_state.setCurrentAction(this.name);
        const rand = Math.random();
        if (rand < .2) game_state.setExpectResult(FapOnBraAction_1.FAIL_STR); else game_state.setExpectResult(FapOnBraAction_1.SUCCESS_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        let delta_trust = 0;
        let delta_mood = 0;
        switch (game_state.getExpectResult()) {
         case FapOnBraAction_1.SUCCESS_STR:
          delta_trust -= 1;
          break;

         case FapOnBraAction_1.FAIL_STR:
          if (game_state.getMood() === -2) delta_trust -= 5; else delta_mood -= 1;
        }
        game_state.deltaMinutes(+30);
        game_state.setSmallPlace("客廳");
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== HuntOfBraAction.prototype.name) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    FapOnBraAction = FapOnBraAction_1 = __decorate([ Action.registry.register(FapOnBraAction.prototype.name) ], FapOnBraAction);
    let SleepAction = class SleepAction extends Action {
      static {
        SleepAction_1 = this;
      }
      static MOOD_INCREASE_STR="提高心情";
      static MOOD_DECREASE_STR="降低心情";
      get category() {
        return null;
      }
      get name() {
        return "今天就這樣睡吧";
      }
      start(game_state) {
        game_state.setSmallPlace("哥哥的睡房");
        game_state.setCurrentAction(this.name);
        const rand = Math.random();
        switch (game_state.getMood()) {
         case -2:
          if (rand < .63) game_state.setExpectResult(SleepAction_1.MOOD_INCREASE_STR);
          break;

         case 1:
         case 2:
          if (rand < .13) game_state.setExpectResult(SleepAction_1.MOOD_DECREASE_STR);
        }
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        if (game_state.isCurrentDateTimeBetween(19, 0, 20, 0)) game_state.deltaStamina(+65); else if (game_state.isCurrentDateTimeBetween(20, 0, 21, 0)) game_state.deltaStamina(+60); else if (game_state.isCurrentDateTimeBetween(21, 0, 22, 0)) game_state.deltaStamina(+55); else if (game_state.isCurrentDateTimeBetween(22, 0, 23, 0)) game_state.deltaStamina(+50); else if (game_state.isCurrentDateTimeBetween(24, 0, 0, 0)) game_state.deltaStamina(+45); else if (game_state.isCurrentDateTimeBetween(0, 0, 1, 0)) game_state.deltaStamina(+40); else if (game_state.isCurrentDateTimeBetween(1, 0, 2, 0)) game_state.deltaStamina(+35); else if (game_state.isCurrentDateTimeBetween(2, 0, 3, 0)) game_state.deltaStamina(+30); else if (game_state.isCurrentDateTimeBetween(3, 0, 4, 0)) game_state.deltaStamina(+20); else if (game_state.isCurrentDateTimeBetween(4, 0, 5, 0)) game_state.deltaStamina(+10);
        let delta_mood = 0;
        let delta_trust = 0;
        let delta_interest = 0;
        switch (game_state.getMood()) {
         case -2:
          delta_trust -= 3;
          delta_interest -= 2;
          if (game_state.getExpectResult() === SleepAction_1.MOOD_INCREASE_STR) delta_mood += 1;
          break;

         case -1:
          delta_trust -= 2;
          delta_interest -= 1;
          break;

         case 0:
          delta_trust -= 1;
          delta_interest -= 1;
          break;

         case 1:
          delta_interest -= 1;
          if (game_state.getExpectResult() == SleepAction_1.MOOD_DECREASE_STR) delta_mood -= 1;
          break;

         case 2:
          delta_trust += 1;
          if (game_state.getExpectResult() === SleepAction_1.MOOD_DECREASE_STR) delta_mood -= 1;
        }
        delta_interest -= 2;
        if (game_state.getInterest() >= 200) delta_interest -= 3;
        game_state.deltaTrust(delta_trust);
        game_state.deltaInterest(delta_interest);
        game_state.deltaMood(delta_mood);
        game_state.deltaDatetimeUntil(7, 0);
        game_state.setSmallPlace("客廳");
        game_state.setCurrentAction(MorningAction.prototype.name);
        game_state.setExpectResult(Action.NONE_STR);
        game_state.setFlagBath(false);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.TRUST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INTEREST_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.FLAGS_KEY ];
      }
      isPossible(game_state) {
        if (!game_state.isCurrentDateTimeAtNight()) return false;
        if (!game_state.isAlreadyBath()) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    SleepAction = SleepAction_1 = __decorate([ Action.registry.register(SleepAction.prototype.name) ], SleepAction);
    let MorningAction = MorningAction_1 = class MorningAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "早上互動";
      }
      start(game_state) {
        game_state.setCurrentAction(MorningAction_1.prototype.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        if (game_state.isWeekday()) {
          game_state.deltaDatetimeUntil(8, 30);
          (new SchoolAction).start(game_state);
        }
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new SchoolAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(_game_state) {
        return false;
      }
      isForce(_game_state) {
        return false;
      }
    };
    MorningAction = MorningAction_1 = __decorate([ Action.registry.register(MorningAction.prototype.name) ], MorningAction);
    let SchoolAction = SchoolAction_1 = class SchoolAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "上學";
      }
      start(game_state) {
        game_state.setBigPlace("校園區");
        game_state.setMiddlePlace("校舍");
        game_state.setSmallPlace("課室");
        game_state.setCurrentAction(SchoolAction_1.prototype.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        game_state.deltaDatetimeUntil(18, 0);
        (new SelfBuyMealAction).start(game_state);
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new SelfBuyMealAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(_game_state) {
        return false;
      }
      isForce(_game_state) {
        return false;
      }
    };
    SchoolAction = SchoolAction_1 = __decorate([ Action.registry.register(SchoolAction.prototype.name) ], SchoolAction);
    let SelfBuyMealAction = SelfBuyMealAction_1 = class SelfBuyMealAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "哥哥一個人購買晚餐食材";
      }
      start(game_state) {
        game_state.addShopItem("茶", 1e3, null);
        game_state.addShopItem("玉露", 5e3, null);
        game_state.addShopItem("咖啡", 1e3, null);
        game_state.addShopItem("紅茶", 2e3, null);
        game_state.setBigPlace("市中心");
        game_state.setMiddlePlace("商業街");
        game_state.setSmallPlace("街道");
        game_state.setCurrentAction(SelfBuyMealAction_1.prototype.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SHOP_ITEMS_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        game_state.deltaDatetimeUntil(18, 30);
        (new DinnerAction).start(game_state);
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new DinnerAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(_game_state) {
        return false;
      }
      isForce(_game_state) {
        return false;
      }
    };
    SelfBuyMealAction = SelfBuyMealAction_1 = __decorate([ Action.registry.register(SelfBuyMealAction.prototype.name) ], SelfBuyMealAction);
    let BuyCupNoodleAction = class BuyCupNoodleAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "把泡麵買回家";
      }
      start(game_state) {
        game_state.setBigPlace("市中心");
        game_state.setMiddlePlace("商業街");
        game_state.setSmallPlace("便利店");
        game_state.setCurrentAction(this.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        game_state.deltaInventory("泡麵", +1);
        game_state.deltaDatetimeUntil(18, 30);
        (new DinnerAction).start(game_state);
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INVENTORIES_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new DinnerAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    BuyCupNoodleAction = __decorate([ Action.registry.register(BuyCupNoodleAction.prototype.name) ], BuyCupNoodleAction);
    let BuyStaminaIngredientsAction = class BuyStaminaIngredientsAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "把體力食材買回家 [3000元]";
      }
      start(game_state) {
        game_state.setBigPlace("市中心");
        game_state.setMiddlePlace("商業街");
        game_state.setSmallPlace("菜市場");
        game_state.setCurrentAction(this.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        game_state.deltaInventory("體力食材", +1);
        game_state.deltaMoney(-3e3);
        game_state.deltaDatetimeUntil(18, 30);
        (new DinnerAction).start(game_state);
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INVENTORIES_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MONEY_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new DinnerAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
        if (game_state.getMoney() < 3e3) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    BuyStaminaIngredientsAction = __decorate([ Action.registry.register(BuyStaminaIngredientsAction.prototype.name) ], BuyStaminaIngredientsAction);
    let BuyBentoAction = class BuyBentoAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "把便當買回家 [2000元]";
      }
      start(game_state) {
        game_state.setBigPlace("市中心");
        game_state.setMiddlePlace("商業街");
        game_state.setSmallPlace("便當店");
        game_state.setCurrentAction(this.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        game_state.deltaInventory("便當", +1);
        game_state.deltaMoney(-2e3);
        game_state.deltaDatetimeUntil(18, 30);
        (new DinnerAction).start(game_state);
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INVENTORIES_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MONEY_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new DinnerAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
        if (game_state.getMoney() < 2e3) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    BuyBentoAction = __decorate([ Action.registry.register(BuyBentoAction.prototype.name) ], BuyBentoAction);
    let BuyCookingIngredientsAction = class BuyCookingIngredientsAction extends Action {
      get category() {
        return null;
      }
      get name() {
        return "把食材買回家 [1000元]";
      }
      start(game_state) {
        game_state.setBigPlace("市中心");
        game_state.setMiddlePlace("商業街");
        game_state.setSmallPlace("超級市場");
        game_state.setCurrentAction(this.name);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        game_state.deltaInventory("食材", +1);
        game_state.deltaMoney(-1e3);
        game_state.deltaDatetimeUntil(18, 30);
        (new DinnerAction).start(game_state);
      }
      getFinishRestoreKeys() {
        const keys = [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INVENTORIES_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MONEY_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY ];
        keys.concat((new DinnerAction).getStartRestoreKeys());
        return keys;
      }
      isPossible(game_state) {
        if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
        if (game_state.getMoney() < 1e3) return false;
        return true;
      }
      isForce(_game_state) {
        return false;
      }
    };
    BuyCookingIngredientsAction = __decorate([ Action.registry.register(BuyCookingIngredientsAction.prototype.name) ], BuyCookingIngredientsAction);
    let DinnerAction = class DinnerAction extends Action {
      static {
        DinnerAction_1 = this;
      }
      static CUP_NOODLE_SUCCESS_STR="食完杯麵作為晚餐，沒有特別變化";
      static CUP_NOODLE_FAIL_STR="食完杯麵作為晚餐，降低妹妹心情";
      static STAMINA_INGREDIENTS_STR="食完用體力食材做的晚餐";
      static BENTO_STR="食完便當作為晚餐";
      static COOKING_INGREDIENTS_STR="食完用食材做的晚餐";
      get category() {
        return null;
      }
      get name() {
        return "吃晚餐";
      }
      start(game_state) {
        const dinner_name = game_state.getDinnerInventory();
        switch (dinner_name) {
         case "體力食材":
          game_state.setExpectResult(DinnerAction_1.STAMINA_INGREDIENTS_STR);
          break;

         case "便當":
          game_state.setExpectResult(DinnerAction_1.BENTO_STR);
          break;

         case "食材":
          game_state.setExpectResult(DinnerAction_1.COOKING_INGREDIENTS_STR);
          break;

         case "杯麵":
          if (Math.random() < .5) game_state.setExpectResult(DinnerAction_1.CUP_NOODLE_SUCCESS_STR); else game_state.setExpectResult(DinnerAction_1.CUP_NOODLE_FAIL_STR);
          break;
        }
        game_state.clearShopItems();
        game_state.setBigPlace("住宅區");
        game_state.setMiddlePlace("家中");
        game_state.setSmallPlace("客廳");
        game_state.setCurrentAction(this.name);
      }
      getStartRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SHOP_ITEMS_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.BIG_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MIDDLE_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.SMALL_PLACE_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      finish(game_state) {
        let dinner_inventory = "";
        let delta_stamina = 0;
        let delta_minute = 0;
        let delta_mood = 0;
        switch (game_state.getExpectResult()) {
         case DinnerAction_1.STAMINA_INGREDIENTS_STR:
          dinner_inventory = "體力食材";
          delta_stamina += 20;
          delta_minute += 90;
          break;

         case DinnerAction_1.BENTO_STR:
          dinner_inventory = "便當";
          delta_stamina += 10;
          delta_minute += 30;
          break;

         case DinnerAction_1.COOKING_INGREDIENTS_STR:
          dinner_inventory = "食材";
          delta_stamina += 15;
          delta_minute += 90;
          break;

         case DinnerAction_1.CUP_NOODLE_SUCCESS_STR:
          dinner_inventory = "泡麵";
          delta_stamina += 5;
          delta_minute += 30;
          break;

         case DinnerAction_1.CUP_NOODLE_FAIL_STR:
          dinner_inventory = "泡麵";
          delta_stamina += 5;
          delta_minute += 30;
          delta_mood -= 1;
        }
        game_state.deltaInventory(dinner_inventory, -1);
        game_state.deltaStamina(delta_stamina);
        game_state.deltaMinutes(delta_minute);
        game_state.deltaMood(delta_mood);
        game_state.setCurrentAction(Action.NONE_STR);
        game_state.setExpectResult(Action.NONE_STR);
      }
      getFinishRestoreKeys() {
        return [ _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.INVENTORIES_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.STAMINA_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.DATETIME_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.MOOD_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.CURRENT_ACTION_KEY, _game_state__WEBPACK_IMPORTED_MODULE_1__.GameState.EXPECT_RESULT_KEY ];
      }
      isPossible(_game_state) {
        return false;
      }
      isForce(_game_state) {
        return false;
      }
    };
    DinnerAction = DinnerAction_1 = __decorate([ Action.registry.register(DinnerAction.prototype.name) ], DinnerAction);
  },
  "./src/黑白妹VT/action_command.ts": 
  /*!*************************************!*\
  !*** ./src/黑白妹VT/action_command.ts ***!
  \*************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      CreateItemCommand: () => CreateItemCommand,
      DeltaInterestROCCommand: () => DeltaInterestROCCommand,
      DeltaMinutesCommand: () => DeltaMinutesCommand,
      DeltaMoneyCommand: () => DeltaMoneyCommand,
      DeltaMoodROCCommand: () => DeltaMoodROCCommand,
      DeltaTrustROCCommand: () => DeltaTrustROCCommand,
      FinishActionCommand: () => FinishActionCommand,
      InitializeCommand: () => InitializeCommand,
      SetBigPlaceCommand: () => SetBigPlaceCommand,
      SetClothingCommand: () => SetClothingCommand,
      SetMiddlePlaceCommand: () => SetMiddlePlaceCommand,
      SetSmallPlaceCommand: () => SetSmallPlaceCommand,
      SetWeatherCommand: () => SetWeatherCommand,
      StartActionCommand: () => StartActionCommand,
      deltaInventoryCommand: () => deltaInventoryCommand
    });
    var _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/VariableTracker/command */ "./src/VariableTracker/command.ts");
    var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ "./src/黑白妹VT/action.ts");
    var _game_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game_state */ "./src/黑白妹VT/game_state.ts");
    var __decorate = undefined && undefined.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = undefined && undefined.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var InitializeCommand_1, StartActionCommand_1, FinishActionCommand_1, DeltaMinutesCommand_1, SetBigPlaceCommand_1, SetMiddlePlaceCommand_1, SetSmallPlaceCommand_1, SetWeatherCommand_1, SetClothingCommand_1, DeltaTrustROCCommand_1, DeltaInterestROCCommand_1, DeltaMoodROCCommand_1, DeltaMoneyCommand_1, CreateItemCommand_1, deltaInventoryCommand_1;
    let InitializeCommand = InitializeCommand_1 = class InitializeCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      get REGEX() {
        return /initialize\(\)/g;
      }
      create(_args) {
        return new InitializeCommand_1;
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        const commands = new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Commands;
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.STAMINA_KEY, 0, 60, 40));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MONEY_KEY, 0, null, 6e3));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.TRUST_KEY, 0, 1e3, 25));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.INTEREST_KEY, 0, 1e3, 10));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MOOD_KEY, -2, 2, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitDatetimeCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.DATETIME_KEY, "2025-11-19T19:00:00"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.BIG_PLACE_KEY, "住宅區"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MIDDLE_PLACE_KEY, "家中"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.SMALL_PLACE_KEY, "客廳"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.WEATHER_KEY, "晴朗"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.CLOTHING_KEY, "初中生水手服，領口的鈕扣解開了，胸前鈕扣間的縫隙露出一小片屬於胸罩的白色布料"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.CURRENT_ACTION_KEY, _action__WEBPACK_IMPORTED_MODULE_1__.Action.NONE_STR));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.EXPECT_RESULT_KEY, _action__WEBPACK_IMPORTED_MODULE_1__.Action.NONE_STR));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAGS_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAG_BATH_KEY, 0, 1, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.AddMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAGS_KEY, _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAG_BATH_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.SHOP_ITEMS_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.INVENTORIES_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.TRUST_ROC_KEY, null, null, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.INTEREST_ROC_KEY, null, null, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MOOD_ROC_KEY, null, null, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.ITEM_TABLE_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.SUMMARY_TABLE_KEY));
        commands.execute(game_state);
        return game_state;
      }
    };
    InitializeCommand = InitializeCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register() ], InitializeCommand);
    let StartActionCommand = StartActionCommand_1 = class StartActionCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      current_action;
      expected_result;
      constructor(current_action, expected_result) {
        super();
        this.current_action = current_action;
        this.expected_result = expected_result;
      }
      get REGEX() {
        return /actionStart\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const current_action = args[0].slice(1, -1);
        const expected_result = args[1].slice(1, -1);
        return new StartActionCommand_1(current_action, expected_result);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setCurrentAction(this.current_action);
        game_state.setExpectResult(this.expected_result);
        game_state.resetTrustROC();
        game_state.resetInterestROC();
        game_state.resetMoodROC();
        return game_state;
      }
    };
    StartActionCommand = StartActionCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], StartActionCommand);
    let FinishActionCommand = FinishActionCommand_1 = class FinishActionCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      summary;
      weighting;
      constructor(summary, weighting) {
        super();
        this.summary = summary;
        this.weighting = weighting;
      }
      get REGEX() {
        return /actionFinish\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const summary = args[0].slice(1, -1);
        const weighting = Number(args[1]);
        return new FinishActionCommand_1(summary, weighting);
      }
      isValid() {
        if (isNaN(this.weighting)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setCurrentAction(_action__WEBPACK_IMPORTED_MODULE_1__.Action.NONE_STR);
        game_state.setExpectResult(_action__WEBPACK_IMPORTED_MODULE_1__.Action.NONE_STR);
        game_state.finishCurrentAction(this.summary, this.weighting);
        return game_state;
      }
    };
    FinishActionCommand = FinishActionCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String, Number ]) ], FinishActionCommand);
    let DeltaMinutesCommand = DeltaMinutesCommand_1 = class DeltaMinutesCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      delta_minutes;
      constructor(delta_minutes) {
        super();
        this.delta_minutes = delta_minutes;
      }
      get REGEX() {
        return /deltaMinutes\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const delta_minutes = Number(args[0]);
        return new DeltaMinutesCommand_1(delta_minutes);
      }
      isValid() {
        if (isNaN(this.delta_minutes)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        const start_year = game_state.getYear();
        const start_month = game_state.getMonth();
        const start_date = game_state.getDate();
        game_state.deltaMinutes(this.delta_minutes);
        const end_year = game_state.getYear();
        const end_month = game_state.getMonth();
        const end_date = game_state.getDate();
        game_state.handleChangeDateEvents(start_year, start_month, start_date, end_year, end_month, end_date);
        return game_state;
      }
    };
    DeltaMinutesCommand = DeltaMinutesCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ Number ]) ], DeltaMinutesCommand);
    let SetBigPlaceCommand = SetBigPlaceCommand_1 = class SetBigPlaceCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      big_place;
      constructor(big_place) {
        super();
        this.big_place = big_place;
      }
      get REGEX() {
        return /setBigPlace\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const big_place = args[0].slice(1, -1);
        return new SetBigPlaceCommand_1(big_place);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setBigPlace(this.big_place);
        return game_state;
      }
    };
    SetBigPlaceCommand = SetBigPlaceCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], SetBigPlaceCommand);
    let SetMiddlePlaceCommand = SetMiddlePlaceCommand_1 = class SetMiddlePlaceCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      middle_place;
      constructor(middle_place) {
        super();
        this.middle_place = middle_place;
      }
      get REGEX() {
        return /setMiddlePlace\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const middle_place = args[0].slice(1, -1);
        return new SetMiddlePlaceCommand_1(middle_place);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setMiddlePlace(this.middle_place);
        return game_state;
      }
    };
    SetMiddlePlaceCommand = SetMiddlePlaceCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], SetMiddlePlaceCommand);
    let SetSmallPlaceCommand = SetSmallPlaceCommand_1 = class SetSmallPlaceCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      small_place;
      constructor(small_place) {
        super();
        this.small_place = small_place;
      }
      get REGEX() {
        return /setSmallPlace\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const small_place = args[0].slice(1, -1);
        return new SetSmallPlaceCommand_1(small_place);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setSmallPlace(this.small_place);
        return game_state;
      }
    };
    SetSmallPlaceCommand = SetSmallPlaceCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], SetSmallPlaceCommand);
    let SetWeatherCommand = SetWeatherCommand_1 = class SetWeatherCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      weather;
      constructor(weather) {
        super();
        this.weather = weather;
      }
      get REGEX() {
        return /setWeather\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const weather = args[0].slice(1, -1);
        return new SetWeatherCommand_1(weather);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setWeather(this.weather);
        return game_state;
      }
    };
    SetWeatherCommand = SetWeatherCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], SetWeatherCommand);
    let SetClothingCommand = SetClothingCommand_1 = class SetClothingCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      clothing;
      constructor(clothing) {
        super();
        this.clothing = clothing;
      }
      get REGEX() {
        return /setClothing\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const clothing = args[0].slice(1, -1);
        return new SetClothingCommand_1(clothing);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.setClothing(this.clothing);
        return game_state;
      }
    };
    SetClothingCommand = SetClothingCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String ]) ], SetClothingCommand);
    let DeltaTrustROCCommand = DeltaTrustROCCommand_1 = class DeltaTrustROCCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      delta_trust_roc;
      constructor(delta_trust_roc) {
        super();
        this.delta_trust_roc = delta_trust_roc;
      }
      get REGEX() {
        return /deltaTrustROC\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const delta_trust_roc = Number(args[0]);
        return new DeltaTrustROCCommand_1(delta_trust_roc);
      }
      isValid() {
        if (isNaN(this.delta_trust_roc)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        if (this.delta_trust_roc < -3) this.delta_trust_roc = -3;
        if (this.delta_trust_roc > 3) this.delta_trust_roc = 3;
        if (this.delta_trust_roc < 0) this.delta_trust_roc *= 2;
        game_state.deltaTrustROC(this.delta_trust_roc);
        return game_state;
      }
    };
    DeltaTrustROCCommand = DeltaTrustROCCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ Number ]) ], DeltaTrustROCCommand);
    let DeltaInterestROCCommand = DeltaInterestROCCommand_1 = class DeltaInterestROCCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      delta_interest_roc;
      constructor(delta_interest_roc) {
        super();
        this.delta_interest_roc = delta_interest_roc;
      }
      get REGEX() {
        return /deltaInterestROC\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const delta_interest_roc = Number(args[0]);
        return new DeltaInterestROCCommand_1(delta_interest_roc);
      }
      isValid() {
        if (isNaN(this.delta_interest_roc)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        if (this.delta_interest_roc < -3) this.delta_interest_roc = -3;
        if (this.delta_interest_roc > 3) this.delta_interest_roc = 3;
        if (this.delta_interest_roc < 0) this.delta_interest_roc *= 2;
        game_state.deltaInterestROC(this.delta_interest_roc);
        return game_state;
      }
    };
    DeltaInterestROCCommand = DeltaInterestROCCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ Number ]) ], DeltaInterestROCCommand);
    let DeltaMoodROCCommand = DeltaMoodROCCommand_1 = class DeltaMoodROCCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      delta_mood_roc;
      constructor(delta_mood_roc) {
        super();
        this.delta_mood_roc = delta_mood_roc;
      }
      get REGEX() {
        return /deltaMoodROC\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const delta_mood_roc = Number(args[0]);
        return new DeltaMoodROCCommand_1(delta_mood_roc);
      }
      isValid() {
        if (isNaN(this.delta_mood_roc)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        if (this.delta_mood_roc < -3) this.delta_mood_roc = -3;
        if (this.delta_mood_roc > 3) this.delta_mood_roc = 3;
        if (this.delta_mood_roc < 0) this.delta_mood_roc *= 2;
        game_state.deltaMoodROC(this.delta_mood_roc);
        return game_state;
      }
    };
    DeltaMoodROCCommand = DeltaMoodROCCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ Number ]) ], DeltaMoodROCCommand);
    let DeltaMoneyCommand = DeltaMoneyCommand_1 = class DeltaMoneyCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      delta_money;
      constructor(delta_money) {
        super();
        this.delta_money = delta_money;
      }
      get REGEX() {
        return /deltaMoney\(\s*([^,()]+)\s*\)/g;
      }
      create(args) {
        const delta_money = Number(args[0]);
        return new DeltaMoneyCommand_1(delta_money);
      }
      isValid() {
        if (isNaN(this.delta_money)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.deltaMoney(this.delta_money);
        return game_state;
      }
    };
    DeltaMoneyCommand = DeltaMoneyCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ Number ]) ], DeltaMoneyCommand);
    let CreateItemCommand = CreateItemCommand_1 = class CreateItemCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      name;
      description;
      constructor(name, description) {
        super();
        this.name = name;
        this.description = description;
      }
      get REGEX() {
        return /createItem\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const name = args[0].slice(1, -1);
        const description = args[1].slice(1, -1);
        return new CreateItemCommand_1(name, description);
      }
      isValid() {
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.createItem(this.name, this.description);
        return game_state;
      }
    };
    CreateItemCommand = CreateItemCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String, String ]) ], CreateItemCommand);
    let deltaInventoryCommand = deltaInventoryCommand_1 = class deltaInventoryCommand extends _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command {
      name;
      delta_quantity;
      constructor(name, delta_quantity) {
        super();
        this.name = name;
        this.delta_quantity = delta_quantity;
      }
      get REGEX() {
        return /deltaInventory\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
      }
      create(args) {
        const name = args[0].slice(1, -1);
        const delta_quantity = Number(args[1]);
        return new deltaInventoryCommand_1(name, delta_quantity);
      }
      isValid() {
        if (isNaN(this.delta_quantity)) return false;
        return true;
      }
      execute(state) {
        const game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
        game_state.deltaInventory(this.name, this.delta_quantity);
        return game_state;
      }
    };
    deltaInventoryCommand = deltaInventoryCommand_1 = __decorate([ _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Command.registry.register(), __metadata("design:paramtypes", [ String, Number ]) ], deltaInventoryCommand);
  },
  "./src/黑白妹VT/event_listener.ts": 
  /*!*************************************!*\
  !*** ./src/黑白妹VT/event_listener.ts ***!
  \*************************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    var _VariableTracker_event_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/VariableTracker/event_listener */ "./src/VariableTracker/event_listener.ts");
    var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./src/黑白妹VT/game.ts");
    function getGame() {
      return new _game__WEBPACK_IMPORTED_MODULE_1__.Game((0, _VariableTracker_event_listener__WEBPACK_IMPORTED_MODULE_0__.getCurrentState)());
    }
    function addSuffix(message_id, suffix_string) {
      if (!suffix_string) return;
      let message = getChatMessages(message_id)[0].message;
      message += `\n${suffix_string}`;
      setChatMessages([ {
        message_id,
        message
      } ]);
    }
    function injectBlocks() {
      uninjectPrompts([ "variable_injection" ]);
      const game = getGame();
      let prompt = "";
      prompt += `${game.getStatusStr()}\n`;
      prompt += `${game.getItemTableStr()}`;
      injectPrompts([ {
        id: "variable_injection",
        position: "in_chat",
        depth: 0,
        role: "system",
        content: prompt,
        should_scan: true
      } ], {
        once: false
      });
      injectPrompts([ {
        id: "summary_injection",
        position: "in_chat",
        depth: 9999,
        role: "system",
        content: game.getSummaryTableStr(),
        should_scan: true
      } ], {
        once: false
      });
    }
    eventMakeFirst(tavern_events.CHAT_CREATED, () => {
      console.log("[黑白妹VT] CHAT_CREATED start");
      console.log("[黑白妹VT] CHAT_CREATED end");
    });
    eventMakeLast(tavern_events.GENERATE_AFTER_COMBINE_PROMPTS, () => {
      console.log("[黑白妹VT] GENERATE_AFTER_COMBINE_PROMPTS start");
      injectBlocks();
      console.log("[黑白妹VT] GENERATE_AFTER_COMBINE_PROMPTS end");
    });
  },
  "./src/黑白妹VT/game.ts": 
  /*!***************************!*\
  !*** ./src/黑白妹VT/game.ts ***!
  \***************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      Game: () => Game
    });
    var _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/VariableTracker/command */ "./src/VariableTracker/command.ts");
    var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ "./src/黑白妹VT/action.ts");
    var _game_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game_state */ "./src/黑白妹VT/game_state.ts");
    class Game {
      game_state;
      constructor(state) {
        this.game_state = new _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState(state);
      }
      getGameState() {
        return this.game_state;
      }
      initiateState() {
        const commands = new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.Commands;
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.STAMINA_KEY, 0, 60, 40));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MONEY_KEY, 0, null, 6e3));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.TRUST_KEY, 0, 1e3, 25));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.INTEREST_KEY, 0, 1e3, 10));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MOOD_KEY, -2, 2, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitDatetimeCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.DATETIME_KEY, "2025-11-19T19:00:00"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.BIG_PLACE_KEY, "住宅區"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MIDDLE_PLACE_KEY, "家中"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.SMALL_PLACE_KEY, "客廳"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.WEATHER_KEY, "晴朗"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.CLOTHING_KEY, "初中生水手服，領口的鈕扣解開了，胸前鈕扣間的縫隙露出一小片屬於胸罩的白色布料"));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.CURRENT_ACTION_KEY, _action__WEBPACK_IMPORTED_MODULE_1__.Action.NONE_STR));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitStrCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.EXPECT_RESULT_KEY, _action__WEBPACK_IMPORTED_MODULE_1__.Action.NONE_STR));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAGS_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAG_BATH_KEY, 0, 1, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.AddMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAGS_KEY, _game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.FLAG_BATH_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.SHOP_ITEMS_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.INVENTORIES_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.TRUST_ROC_KEY, null, null, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.INTEREST_ROC_KEY, null, null, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitNumCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.MOOD_ROC_KEY, null, null, 0));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.ITEM_TABLE_KEY));
        commands.pushCommand(new _VariableTracker_command__WEBPACK_IMPORTED_MODULE_0__.InitMapCommand(_game_state__WEBPACK_IMPORTED_MODULE_2__.GameState.SUMMARY_TABLE_KEY));
        commands.execute(this.game_state);
      }
      getForceActionStr() {
        const possible_action_names = new Map;
        for (const [name, action] of _action__WEBPACK_IMPORTED_MODULE_1__.Action.registry.getAll()) {
          if (action.prototype.isForce(this.game_state)) {
            if (action.prototype.category) {
              const category = action.prototype.category;
              const names = possible_action_names.get(category) ?? [];
              names.push(name);
              possible_action_names.set(category, names);
            } else {
              possible_action_names.set(name, null);
            }
          }
        }
        let action_string = "";
        for (const [category, names] of possible_action_names) {
          if (names === null) {
            action_string += `[${category}]\n`;
          } else {
            action_string += `[${category}]:\n`;
            for (const name of names) {
              action_string += `  [${name}]\n`;
            }
          }
        }
        if (action_string) action_string = "<ActionBlock>\n" + action_string + "</ActionBlock>";
        return action_string;
      }
      getPossibleActionStr() {
        const possible_action_names = new Map;
        for (const [name, action] of _action__WEBPACK_IMPORTED_MODULE_1__.Action.registry.getAll()) {
          if (action.prototype.isPossible(this.game_state)) {
            if (action.prototype.category) {
              const category = action.prototype.category;
              const names = possible_action_names.get(category) ?? [];
              names.push(name);
              possible_action_names.set(category, names);
            } else {
              possible_action_names.set(name, null);
            }
          }
        }
        let action_string = "";
        for (const [category, names] of possible_action_names) {
          if (names === null) {
            action_string += `[${category}]\n`;
          } else {
            action_string += `[${category}]:\n`;
            for (const name of names) {
              action_string += `  [${name}]\n`;
            }
          }
        }
        if (action_string) action_string = "<ActionBlock>\n" + action_string + "</ActionBlock>";
        return action_string;
      }
      getForceActions() {
        const force_action_names = new Map;
        for (const [name, action] of _action__WEBPACK_IMPORTED_MODULE_1__.Action.registry.getAll()) {
          if (action.prototype.isForce(this.game_state)) {
            if (action.prototype.category) {
              const category = action.prototype.category;
              const names = force_action_names.get(category) ?? [];
              names.push(name);
              force_action_names.set(category, names);
            } else {
              force_action_names.set(name, null);
            }
          }
        }
        return force_action_names;
      }
      getPossibleActions() {
        const possible_action_names = new Map;
        for (const [name, action] of _action__WEBPACK_IMPORTED_MODULE_1__.Action.registry.getAll()) {
          if (action.prototype.isPossible(this.game_state)) {
            if (action.prototype.category) {
              const category = action.prototype.category;
              const names = possible_action_names.get(category) ?? [];
              names.push(name);
              possible_action_names.set(category, names);
            } else {
              possible_action_names.set(name, null);
            }
          }
        }
        return possible_action_names;
      }
      getStatusStr() {
        let status_string = "";
        status_string += `金錢:$${this.game_state.getMoney()}\n`;
        status_string += `信賴:${this.game_state.getTrust()}\n`;
        status_string += `興致:${this.game_state.getInterest()}\n`;
        const mood_strings = [ "隨時都會爆發的狀態", "不高興", "普通", "不錯", "高興" ];
        status_string += `心情:${mood_strings[this.game_state.getMood() + 2]}\n`;
        const day_strings = [ "日", "一", "二", "三", "四", "五", "六" ];
        status_string += `星期:${day_strings[this.game_state.getDay()]}\n`;
        status_string += `月日:${this.game_state.getMonth()}月${this.game_state.getDate()}日\n`;
        status_string += `時刻:${this.game_state.getHours().toString().padStart(2, "0")}:${this.game_state.getMinutes().toString().padStart(2, "0")}\n`;
        status_string += `大地點:${this.game_state.getBigPlace()}\n`;
        status_string += `中地點:${this.game_state.getMiddlePlace()}\n`;
        status_string += `小地點:${this.game_state.getSmallPlace()}\n`;
        status_string += `天氣:${this.game_state.getWeather()}\n`;
        status_string += `妹妹衣著:${this.game_state.getClothing()}\n`;
        status_string += `當前行動:${this.game_state.getCurrentAction()}\n`;
        status_string += `預期結果:${this.game_state.getExpectResult()}\n`;
        if (status_string) status_string = "<StatusBlock>\n" + status_string + "</StatusBlock>";
        return status_string;
      }
      getItemTableStr() {
        let item_table_string = "<ItemTable>\n";
        const item_table = this.game_state.getItemTable();
        for (const [name, description] of item_table) {
          item_table_string += `${name}: ${description}\n`;
        }
        item_table_string += "<ItemTable>";
        return item_table_string;
      }
      getSummaryTableStr() {
        let summary_table_string = "<SummaryTable>\n";
        summary_table_string += "  #以下為歷史記錄格式，在敍事有需要時必須嚴格遵守此記錄，以免作出矛盾或重複的描寫。\n";
        summary_table_string += "  #| 時間 | 地點 | 事件總結 | 權重(0.0~1.0)，用以標示該事件的重要程度 |\n";
        const summaries = this.game_state.getSummaries();
        for (const summary_record of summaries) {
          if (summary_record === null) continue;
          const year = summary_record.datetime.getFullYear();
          const month = summary_record.datetime.getMonth();
          const date = summary_record.datetime.getDate();
          const hour = summary_record.datetime.getHours();
          const minutes = summary_record.datetime.getMinutes();
          const day = summary_record.datetime.getDay();
          const day_strings = [ "日", "一", "二", "三", "四", "五", "六" ];
          const day_string = day_strings[day];
          const hour_string = hour.toString().padStart(2, "0");
          const minutes_string = minutes.toString().padStart(2, "0");
          const datetime_string = `${year}年${month}月${date}日 (${day_string}) ${hour_string}:${minutes_string}`;
          const location_string = `${summary_record.big_place}-${summary_record.middle_place}-${summary_record.small_place}`;
          summary_table_string += `| ${datetime_string} | ${location_string} | ${summary_record.summary} | ${summary_record.weighting} |\n`;
        }
        summary_table_string += "<SummaryTable>";
        return summary_table_string;
      }
    }
  },
  "./src/黑白妹VT/game_state.ts": 
  /*!*********************************!*\
  !*** ./src/黑白妹VT/game_state.ts ***!
  \*********************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      GameState: () => GameState
    });
    var _VariableTracker_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/VariableTracker/state */ "./src/VariableTracker/state.ts");
    var _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/VariableTracker/variable */ "./src/VariableTracker/variable.ts");
    var _item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./item */ "./src/黑白妹VT/item.ts");
    class GameState extends _VariableTracker_state__WEBPACK_IMPORTED_MODULE_0__.State {
      constructor(state) {
        super(state);
      }
      static get STAMINA_KEY() {
        return "行動力";
      }
      static get MONEY_KEY() {
        return "金錢";
      }
      static get TRUST_KEY() {
        return "信賴";
      }
      static get INTEREST_KEY() {
        return "興致";
      }
      static get MOOD_KEY() {
        return "心情";
      }
      static get CURRENT_ACTION_KEY() {
        return "當前行動";
      }
      static get EXPECT_RESULT_KEY() {
        return "預期結果";
      }
      static get DATETIME_KEY() {
        return "時間";
      }
      static get BIG_PLACE_KEY() {
        return "大地點";
      }
      static get MIDDLE_PLACE_KEY() {
        return "中地點";
      }
      static get SMALL_PLACE_KEY() {
        return "小地點";
      }
      static get WEATHER_KEY() {
        return "天氣";
      }
      static get FLAGS_KEY() {
        return "flags";
      }
      static get FLAG_BATH_KEY() {
        return "洗澡了";
      }
      static get SHOP_ITEMS_KEY() {
        return "shop_items";
      }
      static get INVENTORIES_KEY() {
        return "inventories";
      }
      static get TRUST_ROC_KEY() {
        return "信賴變動";
      }
      static get INTEREST_ROC_KEY() {
        return "興致變動";
      }
      static get MOOD_ROC_KEY() {
        return "心情變動";
      }
      static get ITEM_TABLE_KEY() {
        return "item_table";
      }
      static get CLOTHING_KEY() {
        return "妹妹衣著";
      }
      static get SUMMARY_TABLE_KEY() {
        return "summary_table";
      }
      static get SUMMARY_KEY() {
        return "總結";
      }
      static get WEIGHTING_KEY() {
        return "權重";
      }
      getNumVariable(key) {
        const variable = this.state.get(key);
        if (variable instanceof _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable) return variable; else return null;
      }
      getStrVariable(key) {
        const variable = this.state.get(key);
        if (variable instanceof _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable) return variable; else return null;
      }
      getMapVariable(key) {
        const variable = this.state.get(key);
        if (variable instanceof _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable) return variable; else return null;
      }
      getStaminaVariable() {
        return this.getNumVariable(GameState.STAMINA_KEY);
      }
      getStamina() {
        return this.getStaminaVariable().getNum();
      }
      deltaStamina(delta) {
        this.getStaminaVariable().deltaNum(delta);
      }
      getStaminaHigh() {
        return this.getStaminaVariable().getHigh();
      }
      deltaStaminaHigh(delta) {
        this.getStaminaVariable().deltaHigh(delta);
      }
      getMoneyVariable() {
        return this.getNumVariable(GameState.MONEY_KEY);
      }
      getMoney() {
        return this.getMoneyVariable().getNum();
      }
      deltaMoney(delta) {
        this.getMoneyVariable().deltaNum(delta);
      }
      getTrustVariable() {
        return this.getNumVariable(GameState.TRUST_KEY);
      }
      getTrust() {
        return this.getTrustVariable().getNum();
      }
      deltaTrust(delta) {
        this.getTrustVariable().deltaNum(delta);
      }
      getInterestVariable() {
        return this.getNumVariable(GameState.INTEREST_KEY);
      }
      getInterest() {
        return this.getInterestVariable().getNum();
      }
      deltaInterest(delta) {
        this.getInterestVariable().deltaNum(delta);
      }
      getMoodVariable() {
        return this.getNumVariable(GameState.MOOD_KEY);
      }
      getMood() {
        return this.getMoodVariable().getNum();
      }
      deltaMood(delta) {
        this.getMoodVariable().deltaNum(delta);
      }
      getCurrentAction() {
        return this.getStrVariable(GameState.CURRENT_ACTION_KEY).getStr();
      }
      setCurrentAction(s) {
        this.getStrVariable(GameState.CURRENT_ACTION_KEY).setStr(s);
      }
      getExpectResult() {
        return this.getStrVariable(GameState.EXPECT_RESULT_KEY).getStr();
      }
      setExpectResult(s) {
        this.getStrVariable(GameState.EXPECT_RESULT_KEY).setStr(s);
      }
      getDatetimeVariable() {
        const variable = this.state.get(GameState.DATETIME_KEY);
        if (variable instanceof _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.DatetimeVariable) return variable; else return null;
      }
      getYear() {
        return this.getDatetimeVariable().getYear();
      }
      getMonth() {
        return this.getDatetimeVariable().getMonth();
      }
      getDate() {
        return this.getDatetimeVariable().getDate();
      }
      getHours() {
        return this.getDatetimeVariable().getHours();
      }
      getMinutes() {
        return this.getDatetimeVariable().getMinutes();
      }
      getSeconds() {
        return this.getDatetimeVariable().getSeconds();
      }
      getDay() {
        return this.getDatetimeVariable().getDay();
      }
      isWeekday() {
        switch (this.getDay()) {
         case 1:
         case 2:
         case 3:
         case 4:
         case 5:
          return true;
        }
        return false;
      }
      isWeekend() {
        switch (this.getDay()) {
         case 0:
         case 6:
          return true;
        }
        return false;
      }
      deltaMinutes(delta) {
        this.getDatetimeVariable().deltaDatetime(0, 0, 0, 0, delta, 0);
      }
      deltaDatetimeUntil(hour, minute) {
        const variable = this.getDatetimeVariable();
        const current_hour = variable.getHours();
        const current_minute = variable.getMinutes();
        const current_total_minute = current_hour * 60 + current_minute;
        let target_total_minutes = hour * 60 + minute;
        if (current_total_minute > target_total_minutes) target_total_minutes += 1440;
        const delta_minute = target_total_minutes - current_total_minute;
        variable.deltaDatetime(0, 0, 0, 0, delta_minute, 0);
      }
      getBigPlace() {
        return this.getStrVariable(GameState.BIG_PLACE_KEY).getStr();
      }
      setBigPlace(s) {
        this.getStrVariable(GameState.BIG_PLACE_KEY).setStr(s);
      }
      getMiddlePlace() {
        return this.getStrVariable(GameState.MIDDLE_PLACE_KEY).getStr();
      }
      setMiddlePlace(s) {
        this.getStrVariable(GameState.MIDDLE_PLACE_KEY).setStr(s);
      }
      getSmallPlace() {
        return this.getStrVariable(GameState.SMALL_PLACE_KEY).getStr();
      }
      setSmallPlace(s) {
        this.getStrVariable(GameState.SMALL_PLACE_KEY).setStr(s);
      }
      getWeather() {
        return this.getStrVariable(GameState.WEATHER_KEY).getStr();
      }
      setWeather(s) {
        this.getStrVariable(GameState.WEATHER_KEY).setStr(s);
      }
      getFlagsVariable() {
        return this.getMapVariable(GameState.FLAGS_KEY);
      }
      getFlagBathVariable() {
        return this.getFlagsVariable().getVariable(GameState.FLAG_BATH_KEY);
      }
      isAlreadyBath() {
        return this.getFlagBathVariable().getNum() === 1;
      }
      setFlagBath(already_bath) {
        if (already_bath) this.getFlagBathVariable().deltaNum(+1); else this.getFlagBathVariable().deltaNum(-1);
      }
      getShopItemsVariable() {
        return this.getMapVariable(GameState.SHOP_ITEMS_KEY);
      }
      addShopItem(name, price, max_quantity) {
        const item = _item__WEBPACK_IMPORTED_MODULE_2__.Item.get(name);
        if (!item) return;
        const item_variable = new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable;
        item_variable.setVariable("price", new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable(null, null, price));
        if (max_quantity !== null) {
          item_variable.setVariable("max_quantity", new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable(0, max_quantity, max_quantity));
        }
        const shop_items_variable = this.getShopItemsVariable();
        shop_items_variable.setVariable(item.name, item_variable);
      }
      getShopItem(name) {
        const shop_items_variable = this.getShopItemsVariable();
        const item_variable = shop_items_variable.getVariable(name);
        if (!item_variable) return null;
        const item = _item__WEBPACK_IMPORTED_MODULE_2__.Item.get(name);
        const price = item_variable.getVariable("price").getNum();
        let max_quantity;
        const max_quantity_variable = item_variable.getVariable("max_quantity");
        if (!max_quantity_variable) max_quantity = null; else max_quantity = max_quantity_variable.getNum();
        return {
          item,
          price,
          max_quantity
        };
      }
      getShopItems() {
        const shop_items_variable = this.getShopItemsVariable();
        const shop_items = [];
        for (const key of shop_items_variable.keys()) {
          shop_items.push(this.getShopItem(key));
        }
        return shop_items;
      }
      getShopItemsSize() {
        return this.getShopItemsVariable().size;
      }
      clearShopItems() {
        this.setVariable(GameState.SHOP_ITEMS_KEY, new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable);
      }
      buyShopItem(name, quantity) {
        const shop_items_variable = this.getShopItemsVariable();
        const shop_item_variable = shop_items_variable.getVariable(name);
        if (!shop_item_variable) return;
        const price = shop_item_variable.getVariable("price").getNum();
        this.deltaMoney(-price * quantity);
        const max_quantity_variable = shop_item_variable.getVariable("max_quantity");
        if (max_quantity_variable) {
          max_quantity_variable.deltaNum(-quantity);
        }
        this.deltaInventory(name, quantity);
      }
      sellShopItem(name, quantity) {
        const inventory = this.getInventory(name);
        if (!inventory) return;
        const shop_item = this.getShopItem(name);
        let max_quantity = shop_item.max_quantity;
        if (max_quantity !== null) max_quantity += quantity;
        this.deltaInventory(name, -quantity);
        this.deltaMoney(shop_item.price * quantity);
        this.addShopItem(name, shop_item.price, max_quantity);
      }
      getInventoriesVariable() {
        return this.getMapVariable(GameState.INVENTORIES_KEY);
      }
      deltaInventory(name, quantity) {
        const inventories_variable = this.getInventoriesVariable();
        let quantity_variable = inventories_variable.getVariable(name);
        if (!quantity_variable) quantity_variable = new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable(0, null, quantity); else quantity_variable.deltaNum(quantity);
        if (quantity_variable.getNum() === 0) inventories_variable.deleteVariable(name); else inventories_variable.setVariable(name, quantity_variable);
      }
      getInventory(name) {
        const quantity_variable = this.getInventoriesVariable().getVariable(name);
        if (!quantity_variable) return null;
        const quantity = quantity_variable.getNum();
        const item = this.getItem(name);
        const description = item.description;
        return {
          name,
          description,
          quantity
        };
      }
      hasInventory(name) {
        const item = _item__WEBPACK_IMPORTED_MODULE_2__.Item.get(name);
        if (!item) return false;
        return this.getInventoriesVariable().getVariable(item.name) !== undefined;
      }
      getInventories() {
        const inventories_variable = this.getInventoriesVariable();
        const inventories = [];
        for (const key of inventories_variable.keys()) {
          inventories.push(this.getInventory(key));
        }
        return inventories;
      }
      getDinnerInventory() {
        if (this.hasInventory("體力食材")) return "體力食材";
        if (this.hasInventory("便當")) return "便當";
        if (this.hasInventory("食材")) return "食材";
        return "泡麵";
      }
      getTrustROCVariable() {
        return this.getNumVariable(GameState.TRUST_ROC_KEY);
      }
      getTrustROC() {
        return this.getTrustROCVariable().getNum();
      }
      deltaTrustROC(delta) {
        this.getTrustROCVariable().deltaNum(delta);
      }
      resetTrustROC() {
        this.getTrustROCVariable().deltaNum(-this.getTrustROC());
      }
      getInterestROCVariable() {
        return this.getNumVariable(GameState.INTEREST_ROC_KEY);
      }
      getInterestROC() {
        return this.getInterestROCVariable().getNum();
      }
      deltaInterestROC(delta) {
        this.getInterestROCVariable().deltaNum(delta);
      }
      resetInterestROC() {
        this.getInterestROCVariable().deltaNum(-this.getInterestROC());
      }
      getMoodROCVariable() {
        return this.getNumVariable(GameState.MOOD_ROC_KEY);
      }
      getMoodROC() {
        return this.getMoodROCVariable().getNum();
      }
      deltaMoodROC(delta) {
        this.getMoodROCVariable().deltaNum(delta);
      }
      resetMoodROC() {
        this.getMoodROCVariable().deltaNum(-this.getMoodROC());
      }
      getItemTableVariable() {
        return this.getMapVariable(GameState.ITEM_TABLE_KEY);
      }
      createItem(name, description) {
        const item_table_variable = this.getItemTableVariable();
        const description_variable = new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable(description);
        item_table_variable.setVariable(name, description_variable);
      }
      getItem(name) {
        const item_table_variable = this.getItemTableVariable();
        const description_variable = item_table_variable.getVariable(name);
        if (!description_variable) return null;
        const description = description_variable.getStr();
        return {
          description
        };
      }
      getItemTable() {
        const item_table_variable = this.getItemTableVariable();
        const item_table = new Map;
        for (const name of item_table_variable.keys()) {
          const description_variable = item_table_variable.getVariable(name);
          const description = description_variable.getStr();
          item_table.set(name, description);
        }
        return item_table;
      }
      getClothing() {
        return this.getStrVariable(GameState.CLOTHING_KEY).getStr();
      }
      setClothing(s) {
        this.getStrVariable(GameState.CLOTHING_KEY).setStr(s);
      }
      getSummaryTableVariable() {
        return this.getMapVariable(GameState.SUMMARY_TABLE_KEY);
      }
      addSummary(summary, weighting) {
        const summary_table_variable = this.getSummaryTableVariable();
        const id = summary_table_variable.size;
        const datatime_variable = this.getDatetimeVariable();
        const big_place = this.getBigPlace();
        const middle_place = this.getMiddlePlace();
        const small_place = this.getSmallPlace();
        const summary_variable = new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.MapVariable;
        summary_variable.setVariable(GameState.DATETIME_KEY, datatime_variable);
        summary_variable.setVariable(GameState.BIG_PLACE_KEY, new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable(big_place));
        summary_variable.setVariable(GameState.MIDDLE_PLACE_KEY, new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable(middle_place));
        summary_variable.setVariable(GameState.SMALL_PLACE_KEY, new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable(small_place));
        summary_variable.setVariable(GameState.SUMMARY_KEY, new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.StrVariable(summary));
        summary_variable.setVariable(GameState.WEIGHTING_KEY, new _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.NumVariable(0, 1, weighting));
        summary_table_variable.setVariable(String(id), summary_variable);
      }
      getSummary(id) {
        const summary_table_variable = this.getSummaryTableVariable();
        const summary_variable = summary_table_variable.getVariable(String(id));
        if (!summary_variable) return null;
        const datetime_variable = summary_variable.getVariable(GameState.DATETIME_KEY);
        const datetime = datetime_variable.getDateTime();
        const big_place_variable = summary_variable.getVariable(GameState.BIG_PLACE_KEY);
        const big_place = big_place_variable.getStr();
        const middle_place_variable = summary_variable.getVariable(GameState.MIDDLE_PLACE_KEY);
        const middle_place = middle_place_variable.getStr();
        const small_place_variable = summary_variable.getVariable(GameState.SMALL_PLACE_KEY);
        const small_place = small_place_variable.getStr();
        const summary_string_variable = summary_variable.getVariable(GameState.SUMMARY_KEY);
        const summary = summary_string_variable.getStr();
        const weighting_variable = summary_variable.getVariable(GameState.WEIGHTING_KEY);
        const weighting = weighting_variable.getNum();
        return {
          datetime,
          big_place,
          middle_place,
          small_place,
          summary,
          weighting
        };
      }
      getSummaries() {
        const summary_table_variable = this.getSummaryTableVariable();
        const summaries = [];
        for (let id = 0; id < summary_table_variable.size; id++) {
          summaries.push(this.getSummary(id));
        }
        return summaries;
      }
      finishCurrentAction(summary, weighting) {
        this.addSummary(summary, weighting);
        weighting = Math.trunc(weighting * 10);
        const trust_roc = this.getTrustROC();
        const interest_roc = this.getInterestROC();
        const roc_sum = Math.max(1, Math.abs(trust_roc) + Math.abs(interest_roc));
        let delta_trust = Math.trunc(trust_roc / roc_sum * weighting);
        if (delta_trust < 0) delta_trust *= 2;
        let delta_interest = Math.trunc(interest_roc / roc_sum * weighting);
        if (delta_interest < 0) delta_interest *= 2;
        const mood_roc = this.getMoodROC();
        let delta_mood = 0;
        if (mood_roc > 0 && mood_roc > 10 - weighting) delta_mood = 1; else if (mood_roc < 0 && mood_roc * 2 < weighting - 10) delta_mood = -1;
        console.log("[Action Command] weighting:", weighting);
        console.log("[Action Command] trust_roc:", trust_roc);
        console.log("[Action Command] interest_roc:", interest_roc);
        console.log("[Action Command] roc_sum:", roc_sum);
        console.log("[Action Command] delta_trust:", delta_trust);
        console.log("[Action Command] delta_interest:", delta_interest);
        console.log("[Action Command] mood_roc:", mood_roc);
        console.log("[Action Command] delta_mood:", delta_mood);
        this.deltaTrust(delta_trust);
        this.deltaInterest(delta_interest);
        this.deltaMood(delta_mood);
        this.resetTrustROC();
        this.resetInterestROC();
        this.resetMoodROC();
      }
      handleChangeDateEvents(start_year, start_month, start_date, end_year, end_month, end_date) {
        const normalized_start_date = new Date(start_year, start_month, start_date);
        const normalized_end_date = new Date(end_year, end_month, end_date);
        const delta_date = Math.floor((normalized_end_date.getTime() - normalized_start_date.getTime()) / (1e3 * 60 * 60 * 24));
        if (delta_date <= 0) return;
        this.deltaMoney(+2e3 * delta_date);
      }
      isCurrentDateTimeBetween(start_hour, start_minute, end_hour, end_minute) {
        const datetime_variable = this.state.get(GameState.DATETIME_KEY);
        if (!(datetime_variable instanceof _VariableTracker_variable__WEBPACK_IMPORTED_MODULE_1__.DatetimeVariable)) return false;
        const current_hour = datetime_variable.getHours();
        const current_minute = datetime_variable.getMinutes();
        const current_total_minutes = current_hour * 60 + current_minute;
        const start_total_minutes = start_hour * 60 + start_minute;
        const end_total_minutes = end_hour * 60 + end_minute;
        if (start_total_minutes <= end_total_minutes) {
          return current_total_minutes >= start_total_minutes && current_total_minutes <= end_total_minutes;
        } else {
          return current_total_minutes >= start_total_minutes || current_total_minutes <= end_total_minutes;
        }
      }
      isCurrentDateTimeAtNight() {
        return this.isCurrentDateTimeBetween(19, 0, 0, 0);
      }
    }
  },
  "./src/黑白妹VT/item.ts": 
  /*!***************************!*\
  !*** ./src/黑白妹VT/item.ts ***!
  \***************************/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      Item: () => Item
    });
    var _util_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/util/registry */ "./src/util/registry.ts");
    class Item {
      static registry=new _util_registry__WEBPACK_IMPORTED_MODULE_0__.Registry;
      name;
      description;
      constructor(name, description) {
        this.name = name;
        this.description = description;
      }
      static register(item) {
        Item.registry.register(item.name, item);
      }
      static get(name) {
        return Item.registry.get(name);
      }
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
  /*!****************************!*\
  !*** ./src/黑白妹VT/index.ts ***!
  \****************************/
  __webpack_require__.r(__webpack_exports__);
  var _VariableTracker_event_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../VariableTracker/event_listener */ "./src/VariableTracker/event_listener.ts");
  var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ "./src/黑白妹VT/action.ts");
  var _action_command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action_command */ "./src/黑白妹VT/action_command.ts");
  var _event_listener__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./event_listener */ "./src/黑白妹VT/event_listener.ts");
  var _game_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./game_state */ "./src/黑白妹VT/game_state.ts");
})();
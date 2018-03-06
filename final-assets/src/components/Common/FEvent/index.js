import EE from 'event-emitter';
import mixin from 'smart-mixin';

const mixinProto = mixin({
  componentDidMount: mixin.MANY,
  componentWillMount: mixin.MANY,
  componentWillReceiveProps: mixin.MANY,
  shouldComponentUpdate: mixin.ONCE,
  componentWillUpdate: mixin.MANY,
  componentDidUpdate: mixin.MANY,
  componentWillUnmount: mixin.MANY,
  getChildContext: mixin.MANY_MERGED
});

var win;

if (typeof window !== 'undefined') {
  win = window;
} else if (typeof global !== 'undefined') {
  win = global;
} else if (typeof self !== 'undefined') {
  win = self;
} else {
  win = {};
}

// SingleTon
const instance = win.FEventsInstance = win.FEventsInstance || EE();

FEvent.on = (eventName, eventListener) => {
  instance.on(eventName, eventListener);
  return eventListener;
};

FEvent.once = (eventName, eventListener) => {
  instance.once(eventName, eventListener);
  return eventListener;
};

FEvent.off = instance.off.bind(instance);
FEvent.emit = instance.emit.bind(instance);

// decorator
export default function FEvent (classDeclaration) {
  classDeclaration.prototype.eventsListener = []; // 这里放了组件所有监听的事件对象
  const prototypeMethods = {
    on: function (eventName, eventListener) {
      this.eventsListener.push({ eventName, eventListener });
      return FEvent.on(eventName, eventListener);
    },
    once: function (eventName, eventListener) {
      this.eventsListener.push({ eventName, eventListener });
      return FEvent.once(eventName, eventListener);
    },
    emit: instance.emit.bind(instance),
    off: instance.off.bind(instance),

    componentWillUnmount: function () {
      this.eventsListener.forEach(eventObj => {
        FEvent.off(eventObj.eventName, eventObj.eventListener);
      });
    }
  }

  return mixinProto(classDeclaration.prototype, prototypeMethods);
}
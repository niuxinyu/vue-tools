interface CusElement extends Document {
    [key: string]: any;
}

export const eventHandle = {
    getEvent (event: Event) {
        return event || window.event;
    },
    addEvent (element: CusElement, type: string, handler: (event: any) => void) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else {
            element[`on${type}`] = handler;
        }
    },
    removeEvent (element: CusElement, type: string, handler: (event: any) => void) {
        element.removeEventListener(type, handler, false);
    },
    getWheelDelta (event: any) {
        return event.wheelDelta ? event.wheelDelta : (-event.detail) * 40;
    },
};

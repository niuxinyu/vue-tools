interface CusElement extends Document {
    [key: string]: any;
}

// export const eventCenter = {
//     eventStore: [] as {element}[],
//     registry (element: Element, mark: boolean) {
//         this.eventStore.push({
//
//         })
//     },
// };

export const eventHandle = {
    getEvent (event: Event): Event {
        return event || window.event;
    },
    addEvent (element: CusElement, type: string, handler: (event: any) => void): void {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else {
            element[`on${type}`] = handler;
        }
    },
    removeEvent (element: CusElement, type: string, handler: (event: any) => void): void {
        element.removeEventListener(type, handler, false);
    },
    getWheelDelta (event: any): any {
        return event.wheelDelta ? event.wheelDelta : (-event.detail) * 40;
    },
};

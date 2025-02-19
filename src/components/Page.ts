import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;
    protected _bascetCounter: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._bascetCounter = ensureElement<HTMLElement>('.header__basket-counter');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set basketCounter(value: number) {
        this.setText(this._bascetCounter, String(value));
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
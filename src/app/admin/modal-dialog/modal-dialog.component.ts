import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.scss'],
    animations: [
        trigger('modal', [
        transition('void => *', [
            style({ transform: 'scale3d(.3, .3, .3)' }),
            animate(100)
        ]),
        transition('* => void', [
            animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
        ])
        ])
    ]
})
export class ModalDialogComponent implements OnInit {
    @Input() showModal;
    @Output() choice : EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() {
    }

    /*close(){
        this.choice.emit(false);
    }*/

}

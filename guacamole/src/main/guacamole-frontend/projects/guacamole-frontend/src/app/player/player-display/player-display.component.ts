/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

/**
 * Component which contains a given Guacamole.Display, automatically scaling
 * the display to fit available space.
 */
@Component({
    selector: 'guac-player-display',
    templateUrl: './player-display.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PlayerDisplayComponent implements AfterViewInit, OnChanges {

    /**
     * The Guacamole.Display instance which should be displayed within the
     * directive.
     */
    @Input() display?: Guacamole.Display;

    /**
     * The root element of this instance of the guacPlayerDisplay
     * directive.
     */
    @ViewChild('guacPlayerDisplay') element!: ElementRef<HTMLDivElement>;

    /**
     * The element which serves as a container for the root element of the
     * Guacamole.Display assigned to $scope.display.
     */
    @ViewChild('guacPlayerDisplayContainer') container!: ElementRef<HTMLDivElement>;

    ngAfterViewInit(): void {
        this.addDisplayToContainer(this.display);
    }

    /**
     * Rescales the Guacamole.Display currently assigned to this.display
     * such that it exactly fits within this component's available space.
     * If no display is currently assigned or the assigned display is not
     * at least 1x1 pixels in size, this function has no effect.
     */
    fitDisplay() {

        // Ignore if no display is yet present
        if (!this.display)
            return;

        var displayWidth = this.display.getWidth();
        var displayHeight = this.display.getHeight();

        // Ignore if the provided display is not at least 1x1 pixels
        if (!displayWidth || !displayHeight)
            return;

        // Fit display within available space
        this.display.scale(Math.min(this.element.nativeElement.offsetWidth / displayWidth,
            this.element.nativeElement.offsetHeight / displayHeight));

    };

    ngOnChanges(changes: SimpleChanges): void {

        if (changes['display']) {
            // Automatically add/remove the Guacamole.Display as this.display is
            // updated
            const display = changes['display'].currentValue as Guacamole.Display;
            const oldDisplay = changes['display'].previousValue as Guacamole.Display;

            // Clear out old display, if any
            if (oldDisplay) {
                this.container.nativeElement.innerHTML = '';
                // @ts-ignore
                oldDisplay.onresize = null;
            }

            this.addDisplayToContainer(display);
        }
    }

    /**
     * If a new display is provided, add it to the container, keeping
     * its scale in sync with changes to available space and display
     * size.
     *
     * @private
     */
    private addDisplayToContainer(display: Guacamole.Display | undefined) {
        if (display && this.container?.nativeElement) {
            this.container.nativeElement.appendChild(display.getElement());
            display.onresize = this.fitDisplay;
            this.fitDisplay();
        }
    }


}
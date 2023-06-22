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

declare namespace ManagedDisplay {
    type Dimensions = typeof ManagedDisplay.Dimensions.prototype;
    type Cursor = typeof ManagedDisplay.Cursor.prototype;
}

/**
 * Provides the ManagedDisplay class used by the guacClientManager service.
 * Object which serves as a surrogate interface, encapsulating a Guacamole
 * display while it is active, allowing it to be detached and reattached
 * from different client views.
 */
export class ManagedDisplay {
    /**
     * The underlying Guacamole display.
     */
    display?: Guacamole.Display;

    /**
     * The current size of the Guacamole display.
     */
    size?: ManagedDisplay.Dimensions;

    /**
     * The current mouse cursor, if any.
     */
    cursor?: ManagedDisplay.Cursor;

    /**
     * @param {ManagedDisplay|Object} [template={}]
     *     The object whose properties should be copied within the new
     *     ManagedDisplay.
     */
    constructor(template: Partial<ManagedDisplay> = {}) {
        this.display = template.display;
        this.size = new ManagedDisplay.Dimensions(template.size);
        this.cursor = template.cursor;
    }

    /**
     * Object which represents the size of the Guacamole display.
     *
     * @constructor
     * @param {ManagedDisplay.Dimensions|Object} template
     *     The object whose properties should be copied within the new
     *     ManagedDisplay.Dimensions.
     */
    static Dimensions = class Dimensions {

        /**
         * The current width of the Guacamole display, in pixels.
         */
        width: number;

        /**
         * The current width of the Guacamole display, in pixels.
         */
        height: number;

        constructor(template: Partial<Dimensions> = {}) {
            this.width = template.width || 0;
            this.height = template.height || 0;
        }
    }

    /**
     * Object which represents a mouse cursor used by the Guacamole display.
     *
     * @constructor
     * @param {ManagedDisplay.Cursor|Object} template
     *     The object whose properties should be copied within the new
     *     ManagedDisplay.Cursor.
     */
    static Cursor = class Cursor {

        /**
         * The actual mouse cursor image.
         */
        canvas?: HTMLCanvasElement;

        /**
         * The X coordinate of the cursor hotspot.
         */
        x?: number;

        /**
         * The Y coordinate of the cursor hotspot.
         */
        y?: number;

        constructor(template: Partial<Cursor> = {}) {
            this.canvas = template.canvas;
            this.x = template.x;
            this.y = template.y;
        }
    }

    /**
     * Creates a new ManagedDisplay which represents the current state of the
     * given Guacamole display.
     *
     * @param display
     *     The Guacamole display to represent. Changes to this display will
     *     affect this ManagedDisplay.
     *
     * @returns
     *     A new ManagedDisplay which represents the current state of the
     *     given Guacamole display.
     */
    static getInstance(display: Guacamole.Display): ManagedDisplay {

        const managedDisplay = new ManagedDisplay({
            display: display
        });

        // Store changes to display size
        display.onresize = function setClientSize() {
            //TODO $rootScope.$apply(function updateClientSize() {
            //updateClientSize
            managedDisplay.size = new ManagedDisplay.Dimensions({
                width: display.getWidth(),
                height: display.getHeight()
            });
            // });
        };

        // Store changes to display cursor
        display.oncursor = function setClientCursor(canvas, x, y) {
            //TODO: $rootScope.$apply(function updateClientCursor() {
            //updateClientCursor
            managedDisplay.cursor = new ManagedDisplay.Cursor({
                canvas: canvas,
                x: x,
                y: y
            });
            // });
        };

        return managedDisplay;
    }

}
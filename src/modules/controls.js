THREE.FirstPersonControls = function(object, domElement) {
    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.debug = false;

    this.movementSpeed = 5;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;
    // this.invertVertical = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.freeze = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    if (this.domElement !== document) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.handleResize = function() {
        if (this.domElement === document) {
            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        } else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    };

    this.onMouseDown = function(event) {
        if (this.domElement !== document) {
            this.domElement.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.activeLook) {
            switch (event.button) {
                case 0:
                    this.moveForward = true;
                    break;
                case 2:
                    this.moveBackward = true;
                    break;
            }
        }

        this.mouseDragOn = true;
    };

    this.onMouseUp = function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.activeLook) {
            switch (event.button) {
                case 0:
                    this.moveForward = false;
                    break;
                case 2:
                    this.moveBackward = false;
                    break;
            }
        }
        this.mouseDragOn = false;
    };

    this.onMouseMove = function(event) {
        if (this.domElement === document) {
            this.mouseX = event.pageX - this.viewHalfX;
            this.mouseY = event.pageY - this.viewHalfY;
        } else {
            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        }
    };

    this.onKeyDown = function(event) {
        //event.preventDefault();
        switch (event.keyCode) {
            case 27:
                /* Esc */
                this.freeze = !this.freeze;

                var pauseMenu = document.getElementById('pauseMenu');
                if (this.freeze) pauseMenu.style.zIndex = '4'; // Render menu above other items
                else pauseMenu.style.zIndex = '0'; // Hide menu
                break;
            case 84:
                /* T */
                if (!this.freeze) this.freeze = true; // Freeze game while player is chatting
                break;
            case 38:
                /* Up */
            case 87:
                /* W */
                this.moveForward = true;
                break;
            case 37:
                /* Left */
            case 65:
                /* A */
                this.moveLeft = true;
                break;
            case 40:
                /* Down */
            case 83:
                /* S */
                this.moveBackward = true;
                break;
            case 39:
                /* Right */
            case 68:
                /* D */
                this.moveRight = true;
                break;
            case 69:
                /* E */
                this.moveDown = true;
                break;
            case 81:
                /* Q */
                this.moveUp = true;
                break;
            case 32:
                /* Spacebar */
                this.moveUp = false;
                break;
            case 16:
                /* Shift */
                this.movementSpeed = 20;
                break;
            case 17:
                /* Control */
                this.movementSpeed = 10;
                break;
            case 114:
                /* F3 */
                event.preventDefault(); // Disable browser shortcuts
                this.debug = !this.debug;

                var debugMenu = document.getElementById('debugMenu');
                if (this.debug) debugMenu.style.zIndex = '2'; // Show menu
                else debugMenu.style.zIndex = '0'; // Hide menu
                break;
        }
    };

    this.onKeyUp = function(event) {
        switch (event.keyCode) {
            case 38:
                /* Up */
            case 87:
                /* W */
                this.moveForward = false;
                break;
            case 37:
                /* Left */
            case 65:
                /* A */
                this.moveLeft = false;
                break;
            case 40:
                /* Down */
            case 83:
                /* S */
                this.moveBackward = false;
                break;
            case 39:
                /* Right */
            case 68:
                /* D */
                this.moveRight = false;
                break;
            case 69:
                /*E*/
                this.moveDown = false;
                break;
            case 81:
                /* Q */
                this.moveUp = false;
                break;
            case 32:
                /* Spacebar */
                this.moveUp = false;
                break;
            case 16:
                /* Shift */
                this.movementSpeed = 5;
                break;
            case 17:
                /* Crouch */
                this.movementSpeed = 5;
                break;
        }
    };

    this.update = function(delta) {
        if (this.freeze) {
            return;
        }

        if (this.heightSpeed) {
            var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
        } else {
            this.autoSpeedFactor = 0.0;
        }

        var actualMoveSpeed = delta * this.movementSpeed;

        if (this.moveForward || (this.autoForward && !this.moveBackward)) this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
        if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

        if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
        if (this.moveRight) this.object.translateX(actualMoveSpeed);

        if (this.moveUp) this.object.translateY(actualMoveSpeed);
        if (this.moveDown) this.object.translateY(-actualMoveSpeed);

        var actualLookSpeed = delta * this.lookSpeed;

        if (!this.activeLook) {
            actualLookSpeed = 0;
        }

        var verticalLookRatio = 1;

        if (this.constrainVertical) {
            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

        }

        this.lon += this.mouseX * actualLookSpeed;
        if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);

        this.theta = THREE.Math.degToRad(this.lon);

        if (this.constrainVertical) {
            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        }

        var targetPosition = this.target,
            position = this.object.position;

        targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        targetPosition.y = position.y + 100 * Math.cos(this.phi);
        targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.object.lookAt(targetPosition);
    };


    this.domElement.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    }, false);

    this.domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);
    this.domElement.addEventListener('mousedown', bind(this, this.onMouseDown), false);
    this.domElement.addEventListener('mouseup', bind(this, this.onMouseUp), false);

    window.addEventListener('keydown', bind(this, this.onKeyDown), false);
    window.addEventListener('keyup', bind(this, this.onKeyUp), false);

    function bind(scope, fn) {
        return function() {
            fn.apply(scope, arguments);
        };
    };

    this.handleResize();
};
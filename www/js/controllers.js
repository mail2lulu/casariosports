/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.logout = function() {
        console.log("inside logout")
        firebase.auth().signOut().then(function() {
            console.log("inside logout successful");
            $state.go('app.login');
            // Sign-out successful.
        }, function(error) {
            // An error happened.
            console.log("inside logout error")
            $state.go('app.login');
        });
    }
    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($rootScope, $scope, $state, $timeout, $stateParams, ionicMaterialInk) {

    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    $scope.googleLogin = function() {
            /** TODO: check if logged in in background */

            // googleLogin
            firebase.auth().signInWithPopup(myAppConfig.provider).then(function(result) {
                console.log("inside auth firebase")
                    // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                myAppConfig.user = user;
                console.log("inside auth firebaseuser.photoURL, user.displayName ", user.photoURL, user.displayName)

                crsapp.firebase.saveUserData(user.photoURL, user.displayName);

                // ...
            }).catch(function(error) {
                console.log("inside auth error")
                    // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });

        } //eo fun

})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    console.log('getUsers users emailVerified:', myAppConfig.user.emailVerified);
    if (myAppConfig.user.emailVerified) {
        var fu = crsapp.firebase.getUsers().then(usersData => {
            const users = usersData.val();
            console.log('getUsers users:', users);
            if (!users) {
                return;
            }
            myAppConfig.users = users;


        })
    }

})

.controller('FormCtrl', function($scope, $state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {





    $('.toggle').on('click', function() {
        $('.container').stop().addClass('active');
    });

    $('.close').on('click', function() {
        $('.container').stop().removeClass('active');
    });

    // Set Header
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        $scope.$parent.hideHeader();

    }, 0);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();


    //////////// BO file upload //////////////

    if (document.getElementById('file')) {

        document.getElementById('file').addEventListener('change', handleFileSelect, false);
    }
    // document.getElementById('file').disabled = true;

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.target.files[0];
        var metadata = {
            'contentType': file.type
        };
        console.log('uploadSimplePic called:', file);
        // Push to child path.

        var fu = crsapp.firebase.uploadSimplePic(file, file.name, "ttts").then(ref => {

            console.log('uploadSimplePic called:', ref);

            if (ref) {
                console.log('if uploadSimplePic ref:');
                $scope.formData.smartcard = ref.toString();
                // appConfig.formData.smartcard = "ref.toString()";
                console.log('if uploadSimplePic $scope.formData.smartcard:', $scope.formData.smartcard);
                // $state.go($state.current, {}, { reload: true });
                $scope.$apply();
            } else {
                console.log('ddd uploadSimplePic else ref:', ref);
            }
        })

    }
    //////////// BO file upload //////////////

    $scope.ownershipChange = function(callee) {
        console.log("ownershipChange:: ", $scope.formData.ownership);
    }
    $scope.logUserData = function(callee) {
        console.log("log User Data callee :: ", callee);
        /** BO User details track */
        var dateObj = getDateFolder("", "logUserData");
        myAppConfig.dateFolder = dateObj.dateStr | "";
        $scope.formData.callee = callee | "no";
        $scope.formData.timeStamp = dateObj.timeStamp | "";
        $scope.formData.dateStr = dateObj.dateStr | "";
        $scope.formData.mobile = $scope.formData.mobile | 0;
        $scope.formData.flat = $scope.formData.flat | 0;
        $scope.formData.wing = $scope.formData.wing | 0;
        $scope.formData.cluster = $scope.formData.cluster | "";

        var res = crsapp.firebase.logMyUserData(callee, myAppConfig.dateFolder, $scope.formData).then(ref => {
            if (ref) {
                console.log('if ref.ref.key:', ref.ref.key);
            } else {
                console.log('dddelse ref:', ref);
            }
        });
        /** EO User details track */
    }

    $scope.formData = myAppConfig.formData;

    $scope.setOwnership = function(type) {
        console.log("ownership type  :: ", type)
        $scope.formData.ownership = type;
    };
    $scope.isOwnership = function(type) {
        return type === $scope.formData.ownership;
    };

    // console.log("$scope.formData :: ", $scope.formData);
    $scope.saveForm = function(form) {
        console.log('form.$valid:', form.$valid);

        var dateObj = getDateFolder("", "saveForm");
        myAppConfig.dateFolder = dateObj.dateStr;
        this.formData.timeStamp = dateObj.timeStamp;
        if (form.$valid) {
            //is a valid form
            $scope.isSubmitted = true;

            var res2 = crsapp.firebase.saveUserFormData($scope.formData).then(ref => {
                if (ref) {
                    console.log('if saveUserFormData ref.ref.key:', ref.ref.key);
                    $scope.logUserData("successform")
                        //go to profile after form filled

                } else {
                    console.log('ddd saveUserFormData else ref:', ref);
                }
                $state.go('app.profile');
            })
        } else {
            $scope.logUserData("tryform")
        }
    };
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

});

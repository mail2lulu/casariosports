/* global angular, document, window */
// 'use strict';

angular.module('starter.controllers', [])
    .filter("emptyToEnd", function() {
        /**
            Moves all 0 based records to last 
        */
        return function(array, key) {
            if (array.length) {
                console.log(" key :: ", key);
            }
            if (!angular.isArray(array)) return;
            var present = array.filter(function(item) {
                return item[key] != 0;
            });
            var empty = array.filter(function(item) {
                return item[key] == 0;
            });
            return present.concat(empty);
        };
    })
    .controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopover, $timeout) {
        try {
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

                    // Sign-out successful.
                }, function(error) {
                    // An error happened.
                    console.log("inside logout error")
                    $state.go("app.login", {}, { location: true });
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

            ///////////// BO image modal //////
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function() {
                $scope.modal.show();
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hide', function() {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                // Execute action
            });
            $scope.$on('modal.shown', function() {
                console.log('Modal is shown!');
            });

            $scope.imageSrc = '';

            $scope.showImage = function(src) {
                $scope.imageSrc = src;
                $scope.openModal();
            };
            ///////////// EO image modal //////

        } catch (error) {
            console.log("catched error:: ", error);
        }
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
                console.log("inside auth error :: ", error)
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
    try {
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
    } catch (error) {
        console.log("catched error:: ", error);
    }
})

.controller('ProfileCtrl', function($scope, $state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $location, $ionicModal, $ionicHistory) {
    try {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        console.log('ProfileCtrl myAppConfig :: ', myAppConfig);
        $scope.settings = {}
            // $state.go("app", {}, { location: true });

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
            var fu2 = crsapp.firebase.getMyTournament().then(playersData => {
                const players = playersData.val();
                console.log('getplayers players:', players);
                if (!players) {
                    return;
                }
                myAppConfig.tournament = players;
                myAppConfig.tournament.userPlayStatus = players.playStatus == 1 ? true : false;
                myAppConfig.tournament.userCaptainStatus = players.captainStatus == 1 ? true : false;
                myAppConfig.tournament.userPaymentStatus = players.paymentStatus == 1 ? true : false;
            })
        }
        $scope.editProfile = function() {
            $state.go("app.form", {}, { location: true });
            // $location.path("/app.form/" + thing.id).replace().reload(false)
        }
        $scope.changePlayStatus = function() {
            console.log("playStatus:: ", myAppConfig.tournament.playStatus);
            var userData = {
                playStatus: myAppConfig.tournament.userPlayStatus ? 1 : 0
            }
            var res2 = crsapp.firebase.saveTournamentData(userData, myAppConfig.user.uid).then(ref => {
                console.log('User updated data ref:', ref);
            })
        }
        $scope.changeCaptainStatus = function() {
            console.log("captainStatus:: ", myAppConfig.tournament.captainStatus);
            var userData = {
                captainStatus: myAppConfig.tournament.userCaptainStatus ? 1 : 0
            }
            var res2 = crsapp.firebase.saveTournamentData(userData, myAppConfig.user.uid).then(ref => {
                console.log('User updated data ref:', ref);
            })
        }
        $scope.changePaymentStatus = function() {
            console.log("paymentStatus:: ", myAppConfig.tournament.paymentStatus);
            var userData = {
                paymentStatus: myAppConfig.tournament.userPaymentStatus ? 1 : 0
            }
            var res2 = crsapp.firebase.saveTournamentData(userData, myAppConfig.user.uid).then(ref => {
                console.log('User updated data ref:', ref);
            })
        }
        $scope.gotoAdmin = function() {
            console.log("gotoAdmin:: ");
            $ionicHistory.clearCache();
            $state.go("app.admin", {}, { reload: true, location: true });
        }




    } catch (error) {
        console.log("catched error:: ", error);
        var fu2 = crsapp.firebase.getMyTournament().then(playersData => {
            const players = playersData.val();
            console.log('getplayers players:', players);
            if (!players) {
                return;
            }
            myAppConfig.tournament = players;
            myAppConfig.tournament.userPlayStatus = players.playStatus == 1 ? true : false;
            myAppConfig.tournament.userCaptainStatus = players.captainStatus == 1 ? true : false;
            myAppConfig.tournament.userPaymentStatus = players.paymentStatus == 1 ? true : false;
        })
    }

})

.controller('AdminCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicHistory, $state) {
    console.log("inside admin page");
    $scope.allPlayingUsers = [];
    $scope.canPlay = false;
    $scope.paid = false;
    $scope.settings = {};



    /////////// BO sorting and filter fun ////////////    
    myAppConfig.sortingTimeKey = "time";
    $scope.sortType = 'full_name'; // set the default sort type
    $scope.sortReverse = true; // set the default sort order
    $scope.searchFilter = ''; // set the default search/filter term

    $scope.onSortClick = function(problemValue) {
        $scope.sortType = problemValue;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.hideName = false;

    $scope.colors2 = { Blue: true, Orange: true };
    /////////// EO sorting and filter fun //////////// 



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

    if (myAppConfig.user.emailVerified) {
        console.log("verified:: ", myAppConfig.user.emailVerified)

        var users = myAppConfig.users;
        for (var prop in users) {
            console.log("prop ", prop)
                // users[prop].uid = prop;
                // users[prop].adminPlayStatus = users[prop].playStatus == 2 ? true : false;
            $scope.allPlayingUsers.push(users[prop]);
        }

        console.log("$scope.allPlayingUsers", $scope.allPlayingUsers);
        $ionicHistory.clearCache();
    }


    $scope.playChange = function(myUser) {
        console.log("playChange ", myUser);
        var uid = myUser.uid;
        myUser.playStatus = myUser.adminPlayStatus ? 2 : 3
        var userData = {
            playStatus: myUser.adminPlayStatus ? 2 : 3
        }

        var res2 = crsapp.firebase.saveTournamentData(userData, uid).then(ref => {
            console.log('updated data ref:', ref);
        })
    }
    $scope.paymentChange = function(myUser) {
        console.log("paymentChange ", myUser);
        var uid = myUser.uid;
        myUser.paymentStatus = myUser.adminPaymentStatus ? 2 : 3
        var userData = {
            paymentStatus: myUser.adminPaymentStatus ? 2 : 3
        }

        var res2 = crsapp.firebase.saveTournamentData(userData, uid).then(ref => {
            console.log('updated data ref:', ref);
        })
    }
    $scope.changeCapVoteSetting = function() {
        console.log("$scope.isCaptainVotingEnable", $scope.settings.isCaptainVotingEnable);
        var settingsData = {
            isCaptainVotingEnable: myAppConfig.settings.isCaptainVotingEnable
        }
        var res2 = crsapp.firebase.setSettingsData(settingsData).then(ref => {
            if (ref) {
                console.log('captain enabled ref.ref.key:', ref.ref.key);
            } else {
                console.log('ddd saveUserFormData else ref:', ref);
            }
        })
    }
    $scope.changeMatchSetting = function() {
        var settingsData = {
            isMatchEnabled: myAppConfig.settings.isMatchEnabled
        }
        var res2 = crsapp.firebase.setSettingsData(settingsData).then(ref => {
            if (ref) {
                console.log('captain enabled ref.ref.key:', ref.ref.key);
            } else {
                console.log('ddd saveUserFormData else ref:', ref);
            }
        })
    }
    $scope.onUserClick = function(clickUser, me) {

        console.log("onUserClick");
        myAppConfig.currUser = clickUser;
        $state.go("app.user", {}, { location: true });

    }
})

.controller('UserCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    console.log("inside UserCtrl page");

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    console.log('ProfileCtrl myAppConfig :: ', myAppConfig);
    $scope.settings = {}
        // $state.go("app", {}, { location: true });

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

})

.controller('PollCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    console.log("inside poll page");
    $scope.allUsers = [];
    $scope.data = {
        showDelete: false
    };
    var fu = crsapp.firebase.getTournamentData().then(usersData => {
        const users = usersData.val();
        console.log('getUsers users:', users);
        if (!users) {
            return;
        }
        myAppConfig.tournamentData = users;
        console.log("myAppConfig gl data:: ", myAppConfig.users)

        for (var prop in users) {
            if (users[prop].captainStatus == 1) {
                users[prop].uid = prop;
                $scope.allUsers.push(users[prop]);
            }
        }
        console.log("$scope.allUsers", $scope.allUsers);
    })

    $scope.edit = function(item) {
        alert('Edit Item: ' + item.id);
    };
    $scope.share = function(item) {
        alert('Share Item: ' + item.id);
    };

    $scope.moveItem = function(item, fromIndex, toIndex) {
        console.log("move item", item, fromIndex, toIndex)
        $scope.allUsers.splice(fromIndex, 1);
        $scope.allUsers.splice(toIndex, 0, item);
    };

    $scope.onItemDelete = function(item) {
        console.log("item delete");
        $scope.allUsers.splice($scope.allUsers.indexOf(item), 1);
    };

    $scope.submitVote = function() {
        for (var i = 0; i < $scope.allUsers.length; i++) {
            /**
            TODO: Check for serial for vote
            */
            $scope.selectUser($scope.allUsers[i].uid, $scope.allUsers.length - i);
        }
    }

    $scope.selectUser = function(uid, rating) {
        var res2 = crsapp.firebase.updateVote(uid, rating).then(ref => {
            if (ref) {
                console.log('if saveUserFormData ref.ref.key:', ref.ref.key);
            } else {
                console.log('ddd saveUserFormData else ref:', ref);
            }
        })
    }

    $scope.checkSettings = function() {

    }
    $scope.electCaptain = function() {
        console.log("inside electCaptain");
        var fu = crsapp.firebase.getCaptains().then(captainsData => {
            const captains = captainsData.val();
            console.log('getUsers captains:', captains);
            if (!captains) {
                return;
            }
            // $scope.allcaptains = captains;
            for (var captain in captains) {
                console.log("captain ", captain)
                if (captains[captain]) {
                    captains[captain].uid = captain;
                    var votes = 0;
                    for (var voter in captains[captain]) {
                        console.log("voter ", voter)
                        if (captains[captain][voter] && voter != 'uid') {
                            console.log("voter data", captains[captain][voter]);
                            votes = votes + captains[captain][voter];
                        }
                    }
                    captains[captain].votes = votes;
                    console.log("captains[captain].votes:: ", captains[captain].votes);
                }
            }

            myAppConfig.captainVotingData = captains;

            console.log("myAppConfig.captainVotingData ", myAppConfig.captainVotingData);

            console.log("$scope.allUsers ", $scope.allUsers)
        })
    }
    $scope.showResults = function() {
        for (var captain in myAppConfig.captainVotingData) {
            console.log("captain ", captain)
            if (myAppConfig.captainVotingData[captain]) {
                console.log("voter data", myAppConfig.captainVotingData[captain]);
            }
        }
    }


})

.controller('FormCtrl', function($scope, $state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    try {
        $('.toggle').on('click', function() {
            $('.container').stop().addClass('active');
        });

        $('.close').on('click', function() {
            $('.container').stop().removeClass('active');
        });

        $scope.wings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        $scope.sizes = [38, 40, 42, 44]
        $scope.clusters = ['ADRIATICA',
            'AMAZONA', 'ANTARCTICA',
            'AQUA', 'ARABIANA',
            'ARCTICA', 'ATLANTICA',
            'Beverelee', 'CASPIANA', 'COLUMBIA',
            'Dionna', 'Erwina', 'Exotica', 'GARDENIA',
            'GENEVIA', 'Genevieve', 'GIARDINO', 'Irvetta',
            'MAGDELENA', 'MARINA', 'MEDITERRANEA', 'Morgana',
            'Muriel', 'NAUTICA', 'NYASIA', 'OCEANIA', 'PACIFICA',
            'PERSIANA', 'Rhine', 'Rilletta', 'RIVER DALE',
            'RIVER RETREAT', 'RIVER VIEW',
            'RIVERSCAPE', 'VICTORIA',
            'VIVA', 'Viviana', 'VOLGA'
        ]


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
        if (document.getElementById('file2')) {

            document.getElementById('file2').addEventListener('change', handleFileSelect, false);
        }
        // document.getElementById('file').disabled = true;

        function handleFileSelect(evt) {
            var filename = "smartcard"
            if (evt.target.id == "file2") {
                filename = "selfie"
            }

            evt.stopPropagation();
            evt.preventDefault();
            var file = evt.target.files[0];
            var metadata = {
                'contentType': file.type
            };
            console.log('uploadSimplePic evt:', evt);
            console.log('uploadSimplePic called:', file);
            // Push to child path.

            var fu = crsapp.firebase.uploadSimplePic(file, filename, "ttts").then(ref => {

                console.log('uploadSimplePic called:', ref);

                if (ref) {
                    console.log('if uploadSimplePic ref:');
                    $scope.formData[filename] = ref.toString();
                    console.log('if uploadSimplePic filename :', $scope.formData[filename]);
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
        console.log("$scope.formData  ", $scope.formData);
        $scope.setOwnership = function(type) {
            console.log("ownership type  :: ", type)
            $scope.formData.ownership = type;
        };
        $scope.isOwnership = function(type) {
            return type === $scope.formData.ownership;
        };

        // console.log("$scope.formData :: ", $scope.formData);
        $scope.saveForm = function(form) {
            console.log("form data:: ", form)
            console.log('form.$valid:', form.$valid);

            var dateObj = getDateFolder("", "saveForm");
            myAppConfig.dateFolder = dateObj.dateStr;
            this.formData.timeStamp = dateObj.timeStamp;
            if (form.$valid) {
                //is a valid form
                $scope.isSubmitted = true;

                var res2 = crsapp.firebase.saveUserFormData($scope.formData).then(ref => {
                    if (ref) {
                        console.log('if saveUserFormData ref.ref.key:');
                        //go to profile after form filled
                        console.log("form saved")
                    } else {
                        console.log('ddd saveUserFormData else ref:', ref);
                    }
                    $state.go("app.profile", {}, { location: true });
                    alert("Your data saved")
                })
            } else {
                console.log("form else:: form.$valid")
                    // $scope.logUserData("tryform")
            }
        };
    } catch (error) {
        console.log("catched error:: ", error);
    }
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    try {
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
    } catch (error) {
        console.log("catched error:: ", error);
    }
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    try {
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
    } catch (error) {
        console.log("catched error:: ", error);
    }
});

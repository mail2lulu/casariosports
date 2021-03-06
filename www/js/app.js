// Ionic Starter App

/**
All Friend list
Captain option by creating events
Send email
create teams
*/

var myAppConfig = {
  vars: {
    appName: "Casa Rio Sports"
  },
  user: {
    displayName: "Anonymous"
  },
  message: {
    formFill: ""
  },
  userInfo: {
    default: "default data"
  },

  formData: {
    ccl2017: false,
    cluster: "",
    flat: "",
    wing: "",
    smartcard: "",
    selfie: "",
    mobile: "",
    fullname: "",
    sportsname: "",
    email: "",
    timeStamp: "",
    dateStr: "",
    isTeamOwner: null,
    ownership: null
  },
  provider: ""
}
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'ngIOS9UIWebViewPatch'])

  .run(function ($ionicPlatform, $rootScope, $ionicPopup, $state, $location, $ionicHistory) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      $rootScope.$location = $location;

      /**
       * show Tournament Confirm
       * @param {*} callee 
       */
      function showTournamentConfirm(callee) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'CCL 2017',
          template: 'Do you want to register and update your profile for CCL 2017?',
          buttons: [{
              text: 'No',
              onTap: function (e) {
                console.log('onTap No: ');
                return false;
              }
            },
            {
              text: '<b>Yes</b>',
              type: 'button-positive',
              onTap: function (e) {
                console.log('onTap yes: ');
                return true;
              }
            },
          ]
        });
        confirmPopup.then(function (res) {
          console.log('onTap then res: ', res);
          if (res) {
            console.log('You are sure');
            myAppConfig.formData.ccl2017 = true;
            $state.go("app.form", {}, {
              location: true
            });
          } else {
            console.log('You are not sure');
            $state.go("app.profile", {}, {
              location: true
            });
          }
        });

      }

      /** Check for user */
      myAppConfig.provider = new firebase.auth.GoogleAuthProvider();
      console.log('myAppConfig.provider: ', myAppConfig.provider);
      console.log("set my app:: ", myAppConfig)
      $rootScope.appConfig = myAppConfig;
      firebase.auth().onAuthStateChanged(function (user) {
        console.log("11 if inside auth changed firebase user :: ", user)
        if (user) {
          // User is signed in.
          console.log("22 if inside auth changed firebase user :: ", user)
          myAppConfig.user = user;
          myAppConfig.formData.email = user.email;
          myAppConfig.formData.fullname = user.displayName;
          //todo: get if form is not filled 
          console.log('uid user.uid: ', user.uid);
          crsapp.firebase.loadUserProfile(user.uid).then(snapshot => {
            const userInfo = snapshot.val();
            console.log("if inside auth changed firebase userInfo :: ", userInfo)
            if (userInfo) {
              myAppConfig.userInfo = userInfo;
              myAppConfig.formData = userInfo;
              // BO load users global settings
              var fu = crsapp.firebase.getSettingsData().then(settingsData => {
                const settings = settingsData.val();
                console.log('getsettings settings:', settings);
                if (!settings) {
                  return;
                }
                myAppConfig.settings = settings;
              })
              // EO load users global settings
              myAppConfig.message.formFill = "Please fill the form";
              $ionicHistory.clearCache();
              if (userInfo.mobile && !userInfo.ccl2017) {
                
                //show confirm
                console.log('user has data but not for CCL 2017 so take him to form after confirm: ');
                showTournamentConfirm();
              } else if (userInfo.mobile) {
                $state.go("app.profile", {}, {
                  location: true
                });
                console.log('user has data so take him to profile: ');
              } else {
                $state.go("app.form", {}, {
                  location: true
                });
              }

            } else {
              $state.go("app.form", {}, {
                location: true
              });
            }
          });
        } else {
          console.log("else inside auth changed firebase user :: ", user)
          $state.go("app.login", {}, {
            location: true
          });
        }
      });
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.activity', {
        url: '/activity',
        views: {
          'menuContent': {
            templateUrl: 'templates/activity.html',
            controller: 'ActivityCtrl'
          },
          'fabContent': {
            template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
            controller: function ($timeout) {
              $timeout(function () {
                // document.getElementById('fab-activity').classList.toggle('on');
              }, 200);
            }
          }
        }
      })

      .state('app.friends', {
        url: '/friends',
        views: {
          'menuContent': {
            templateUrl: 'templates/friends.html',
            controller: 'FriendsCtrl'
          },
          'fabContent': {
            template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
            controller: function ($timeout) {
              $timeout(function () {
                // document.getElementById('fab-friends').classList.toggle('on');
              }, 900);
            }
          }
        }
      })

      .state('app.gallery', {
        url: '/gallery',
        views: {
          'menuContent': {
            templateUrl: 'templates/gallery.html',
            controller: 'GalleryCtrl'
          },
          'fabContent': {
            template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
            controller: function ($timeout) {
              $timeout(function () {
                // document.getElementById('fab-gallery').classList.toggle('on');
              }, 600);
            }
          }
        }
      })

      .state('app.playerpics', {
        url: '/playerpics',
        views: {
          'menuContent': {
            templateUrl: 'templates/playerpics.html',
            controller: 'PlayerpicsCtrl'
          },
          'fabContent': {
            template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
            controller: function ($timeout) {
              $timeout(function () {
                // document.getElementById('fab-gallery').classList.toggle('on');
              }, 600);
            }
          }
        }
      })

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          },
          'fabContent': {
            template: ''
          }
        }
      })

      .state('app.profile', {
        url: '/profile',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          },
          'fabContent': {
            template: '',
            controller: function ($timeout) {

            }
          }
        }
      })

      .state('app.user', {
        url: '/user',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/user.html',
            controller: 'UserCtrl'
          },
          'fabContent': {
            template: '',
            controller: function ($timeout) {

            }
          }
        }
      })

      .state('app.admin', {
        url: '/admin-profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/admin.html',
            controller: 'AdminCtrl'
          },
          'fabContent': {
            template: '',
            controller: function ($timeout) {}
          }
        }
      })
      .state('app.collection', {
        url: '/collection-profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/collection.html',
            controller: 'CollectionCtrl'
          },
          'fabContent': {
            template: '',
            controller: function ($timeout) {}
          }
        }
      })
      .state('app.poll', {
        url: '/poll',
        views: {
          'menuContent': {
            templateUrl: 'templates/poll.html',
            controller: 'PollCtrl'
          },
          'fabContent': {
            template: '',
            controller: function ($timeout) {}
          }
        }
      })
      .state('app.form', {
        url: '/form',
        views: {
          'menuContent': {
            templateUrl: 'templates/form.html',
            controller: 'FormCtrl'
          },
          'fabContent': {
            template: '',
            controller: function ($timeout) {

            }
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  });

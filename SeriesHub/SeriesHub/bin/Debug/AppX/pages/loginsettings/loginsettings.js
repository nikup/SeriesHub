// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var localSettings = Windows.Storage.ApplicationData.current.localSettings;

    WinJS.UI.Pages.define("/pages/loginsettings/loginsettings.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var loginUsernameInput = document.getElementById('login-username-input');
            var loginPasswordInput = document.getElementById('login-password-input');
            var errorOutput = document.getElementById('error-output');
            var loginSettingsFlyout = document.getElementById('login-settings-flyout');
            var userLoginWrapper = document.getElementById('user-login-wrapper');
            var userLogoutWrapper = document.getElementById('user-logout-wrapper');
            var usernameContainer = document.getElementById('username-container');
            var appBar = document.getElementById('app-bar');

            function toggleUserLoggedIn(username) {
                userLoginWrapper.classList.toggle('hidden');
                userLogoutWrapper.classList.toggle('hidden');
                usernameContainer.innerHTML = username;
            }

            if (localSettings.values['account']) {
                toggleUserLoggedIn(localSettings.values['account'].username);
            }
            var sha1 = Windows.Security.Cryptography.Core.HashAlgorithmNames.sha1;
            var hashAlgorithmProvider = Windows.Security.Cryptography.Core.HashAlgorithmProvider.openAlgorithm(sha1);
           
            document.getElementById('login-btn').addEventListener('click', function (event) {
                event.preventDefault();
                var passwordRaw = loginPasswordInput.value;
                var userData = {
                    username: loginUsernameInput.value,
                    password: Windows.Security.Cryptography.CryptographicBuffer.encodeToHexString(hashAlgorithmProvider.hashData(Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(passwordRaw, Windows.Security.Cryptography.BinaryStringEncoding.utf8)))
                };

                ViewModels.loginUser(userData)
                    .done(function (response) {
                        var accountDetails = new Windows.Storage.ApplicationDataCompositeValue();
                        accountDetails['username'] = userData.username;
                        accountDetails['password'] = userData.password;
                        localSettings.values['account'] = accountDetails;
                        ViewModels.setAccountInformation();

                        toggleUserLoggedIn(userData.username);
                        loginSettingsFlyout.winControl.hide();
                        appBar.winControl.showCommands([
                            'app-bar-this-week',
                            'app-bar-home'
                        ]);

                        WinJS.Navigation.navigate('/pages/homelogged/homelogged.html');
                    }, function (error) {
                        errorOutput.innerHTML = 'Invalid username or password.';
                    });
            });

            document.getElementById('logout-btn').addEventListener('click', function (event) {
                event.preventDefault();
                localSettings.values['account'] = null;
                toggleUserLoggedIn('');
                appBar.winControl.hideCommands([
                    'app-bar-this-week',
                    'app-bar-home'
                ]);

                WinJS.Navigation.navigate(Application.navigator.home);
            });
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();

(function () {

	angular.module('aecApp', [
		'ngAnimate', 'ui.router', 'mgcrea.ngStrap', 'ngDisqus', 'hc.marked'
	]);


	/**
	 * @name AppCfg
	 *
	 * @desc Set up the Application
	 */
	function AppCfg( $urlRouterProvider, $stateProvider, $disqusProvider )
	{
		$urlRouterProvider
			.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					"main": {
						templateUrl: '/partials/home.html'
					}
				}
			})

			.state('docs', {
				url: '/docs/:id',
				views: {
					"main": {
						templateUrl: '/partials/doc.html'
					}
				}
			})
		;

		$disqusProvider.setShortname('valanx');
	}

	AppCfg.$inject = ['$urlRouterProvider', '$stateProvider', '$disqusProvider'];
	angular.module('aecApp').config(AppCfg);


	/**
	 * @name AppRun
	 *
	 * @desc Data to prepare when we run the application
	 */
	function AppRun( $rootScope, $state )
	{
		$rootScope.$state = $state;

		$rootScope.$on(
			'$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){
				$rootScope.loading = true;
			});
	}

	AppRun.$inject = ['$rootScope', '$state'];
	angular.module('aecApp').run(AppRun);


	/**
	 * @name HomeCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function HomeCtrl( $scope, $rootScope, $state )
	{
		$rootScope.loading = false;
	}

	HomeCtrl.$inject = ['$scope', '$rootScope', '$state'];
	angular.module('aecApp').controller('HomeCtrl', HomeCtrl);


	/**
	 * @name DocCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function DocCtrl( $scope, $rootScope, $stateParams, $aside, $http )
	{
		var docsNav = $aside(
			{
				scope: $scope,
				template: 'partials/doc.aside.html',
				placement: 'left',
				animation: 'am-fade-and-slide-left',
				backdrop: false,
				keyboard: false,
				container: '#background'
			}
		);

		if ( $stateParams.id == '' ) {
			$stateParams.id = 'welcome';
		}

		$scope.id = $stateParams.id;

		$scope.path = '';

		var switchPage = function(id) {
			angular.forEach($scope.pages, function(page){
				if ( page.handle == id ) {
					$scope.path = '/docs/' + page.path;
				}
			});
		};

		$scope.$watch('id', function(newVal, oldVal) {
			if (newVal !== oldVal) switchPage(newVal);
		});

		$http.get('docs/index.json')
			.then(function(index){
				$scope.pages = index.data;

				switchPage($stateParams.id);
			});

		$rootScope.loading = false;
	}

	DocCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$aside', '$http'];
	angular.module('aecApp').controller('DocCtrl', DocCtrl);


	/**
	 * @name DocAsideCtrl
	 *
	 * @desc Controls Behavior on the side naviation for docs
	 */
	function DocAsideCtrl( $scope, $rootScope, $state, $aside )
	{
		var docsNav = $aside(
			{
				scope: $scope,
				template: 'partials/doc.aside.tpl.html',
				placement: 'left',
				animation: 'am-fade-and-slide-left',
				backdrop: false,
				keyboard: false,
				container: '#background'
			}
		);
	}

	DocAsideCtrl.$inject = ['$scope', '$rootScope', '$state', '$aside'];
	angular.module('aecApp').controller('DocAsideCtrl', DocAsideCtrl);


})();

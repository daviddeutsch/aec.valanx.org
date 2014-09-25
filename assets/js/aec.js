(function () {

	angular.module('aecApp', [
		'ngAnimate', 'ui.router',
		'ct.ui.router.extras', 'mgcrea.ngStrap',
		'ngDisqus', 'hc.marked'
	]);


	/**
	 * @name AppCfg
	 *
	 * @desc Set up the Application
	 */
	function AppCfg( $urlRouterProvider, $stateProvider, $locationProvider, $disqusProvider, $popoverProvider )
	{
		$urlRouterProvider
			.otherwise('/');

		$urlRouterProvider.deferIntercept();

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					"main": {
						templateUrl: '/partials/home.html'
					},
					"background": {
						templateUrl: '/partials/carina.html'
					}
				}
			})

			.state('docs', {
				url: '/docs/:path/:doc',
				views: {
					"main": {
						templateUrl: '/partials/doc.html'
					},
					"background": {
						templateUrl: '/partials/empty.html'
					}
				}
			})

		;

		$disqusProvider.setShortname('valanx');

		$locationProvider.hashPrefix('!');

		angular.extend($popoverProvider.defaults, {
			animation: 'am-fade-and-slide-bottom',
			type: 'info',
			delay: { show: 500, hide: 10 },
			trigger: 'hover',
			placement: 'bottom'
		});
	}

	AppCfg.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider', '$disqusProvider', '$popoverProvider'];
	angular.module('aecApp').config(AppCfg);


	/**
	 * @name AppRun
	 *
	 * @desc Data to prepare when we run the application
	 */
	function AppRun( $rootScope, $state, $location )
	{
		$rootScope.$state = $state;

		$rootScope.$on(
			'$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				$rootScope.loading = true;
			});

		$rootScope.$on(
			'$locationChangeSuccess',
			function(e)
			{
				if ( $state.current.name === "" ) {
					if ( $location.path() === "" ) {
						$location.path("/");
					}
				}
			});
	}

	AppRun.$inject = ['$rootScope', '$state', '$location'];
	angular.module('aecApp').run(AppRun);


	function scrollOnClickDirective($location) {
		return {
			restrict: 'A',
			link: function(scope, $elm, attrs) {
				var settings = angular.extend({
					href: angular.element(),
					offset: 0,
					duration: 800,
					easing: 'easeOutQuint'
				}, attrs);

				settings.href = settings.href.replace('#','');

				$elm.on('click', function(e) {
					//e.preventDefault();

					var scroll;

					if (settings.href) {
						scroll = $('#'+settings.href).offset().top + Number(settings.offset);

						$location.hash(settings.href);
					} else {
						scroll = $elm.offset().top + Number(settings.offset);
					}

					angular.element('html, body').animate(
						{scrollTop: scroll},
						settings.duration,
						settings.easing
					);
				});
			}
		}
	}

	scrollOnClickDirective.$inject = ['$location'];
	angular.module('aecApp').directive('scrollOnClick', scrollOnClickDirective);

	/**
	 * @name HomeCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function HomeCtrl( $rootScope )
	{
		$rootScope.loading = false;

		$rootScope.$broadcast('backHome');

		// TODO: Probably want to replace this with something smarter in the future
		angular.element('html, body').animate(
			{scrollTop: 0},
			200,
			'easeInOutQuint'
		);
	}

	HomeCtrl.$inject = ['$rootScope'];
	angular.module('aecApp').controller('HomeCtrl', HomeCtrl);


	/**
	 * @name ProcessorsCtrl
	 *
	 * @desc Controls Behavior on the processor section
	 */
	function ProcessorsCtrl( $scope, $http )
	{
		$scope.processors = [];

		$http.get('processors.json')
			.then(function(processors){
				$scope.processors = processors.data;
			});
	}

	ProcessorsCtrl.$inject = ['$scope', '$http'];
	angular.module('aecApp').controller('ProcessorsCtrl', ProcessorsCtrl);


	/**
	 * @name IntegrationsCtrl
	 *
	 * @desc Controls Behavior on the mi section
	 */
	function IntegrationsCtrl( $scope, $http )
	{
		$scope.types = {};
		$scope.searchText = '';
		$scope.type = 'communication';
		$scope.mis = [];

		$http.get('mitypes.json')
			.then(function(types){
				$scope.types = types.data;

				$http.get('mis.json')
					.then(function(mis){
						$scope.mis = mis.data;
					});
			});

		$scope.toggleType = function(type) {
			if ( $scope.type == type ) {
				$scope.type = '';
			} else {
				$scope.type = type;
			}
		};

		$scope.eraseSearch = function(type) {
			$scope.searchText = '';
		};
	}

	IntegrationsCtrl.$inject = ['$scope', '$http'];
	angular.module('aecApp').controller('IntegrationsCtrl', IntegrationsCtrl);


	/**
	 * @name DocCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function DocCtrl( $scope, $rootScope, $timeout, $state, $stateParams, $aside, $location, Docs )
	{
		var keepalive,
			id = 0;

		$scope.fullpath = '';

		$scope.pages = [];

		$scope.pagetitle = '';
		$scope.sideindex = [];

		$scope.docready = true;

		if ( typeof $stateParams.path == 'undefined' || $stateParams.path == '' ) {
			$stateParams.path = 'start';
			$stateParams.doc = 'welcome';
		}

		$scope.path = $stateParams.path;
		$scope.doc = $stateParams.doc;

		$scope.showComments = function() {
			return !$scope.loading
				&& ($scope.fullpath != 'start/welcome')
				&& ($scope.fullpath != '');
		};

		$scope.switchPage = function(path) {
			if ( $scope.fullpath == path ) {
				$rootScope.loading = false;

				return;
			}

			$scope.docready = false;

			$rootScope.loading = true;

			$scope.fullpath = path;

			$scope.path = path.split('/')[0];
			$scope.doc = path.split('/')[1];

			if( $location.path() != "/docs/"+path ) {
				$location.path("/docs/"+path);
			}

			Docs.getPage($scope.fullpath)
				.then(function(page){
					$scope.pagetitle = page.pagetitle;
					$scope.sideindex = page.sideindex;
					$scope.content = page.content;

					$timeout(function(){
						angular.element('html, body').animate(
							{scrollTop: 0},
							200,
							'easeInOutQuint'
						);

						$rootScope.loading = false;
						$scope.docready = true;
					}, 80);

					// Still have not figured out why .loading = false above "sometimes" fails
					/*$timeout(function(){
						$rootScope.loading = false;
					}, 4000);*/
				});
		};

		$rootScope.$on(
			'$locationChangeSuccess',
			function(e) {
				var lpath = $location.path();

				if ( lpath.substr(1,4) === "docs" ) {
					if ( lpath.substr(6) !== $scope.fullpath ) {
						$scope.switchPage(lpath.substr(6));
					}
				} else if ( lpath === "/" ) {
					$state.go('home');
				}
			});

		var tick = function () {
			$scope.pages.push(Docs.index[id]);

			id++;

			if ( Docs.index.length > id ) {
				keepalive = $timeout(tick, 40);
			} else {
				$scope.switchPage($stateParams.path+'/'+$stateParams.doc);
			}
		};

		var aside = $aside({
				scope: $scope,
				template: 'partials/doc.aside.html',
				placement: 'left',
				animation: 'am-fade-and-slide-left',
				backdrop: false,
				keyboard: false,
				container: '#background'
			});

		Docs.init()
			.then(function(){
				keepalive = $timeout(tick, 400);
			});

		$rootScope.$on('backHome', function (event, data) {
			aside.hide();
		});
	}

	DocCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', '$aside', '$location', 'Docs'];
	angular.module('aecApp').controller('DocCtrl', DocCtrl);


	/**
	 * @name DocAsideCtrl
	 *
	 * @desc Controls Behavior on the side naviation for docs
	 */
	function DocAsideCtrl( $scope )
	{
		var list = [],
			keepalive,
			id = 0;
	}

	DocAsideCtrl.$inject = ['$scope'];
	angular.module('aecApp').controller('DocAsideCtrl', DocAsideCtrl);

	function DocService( $rootScope, $http, $compile, $q, $sce )
	{
		var self = this,
			headerid = 0;

		this.renderer = {};
		this.index = [];
		this.pages = {};

		this.errorpage = {
			sideindex: [],
			pagetitle: '',
			content: $sce.trustAsHtml('<h1>404</h1><p>Not Found!</p>')
		};

		this.initRenderer = function() {
			this.renderer = new marked.Renderer();

			this.renderer.heading = function (text, level) {
				headerid++;

				var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

				return '<h' + level
					+ ' id="index-' + headerid + '-'
					+ escapedText
					+ '">'
					+ text
					+ '</h' + level + '>';
			};

			this.renderer.table = function (header, body) {
				return '<table class="table table-striped">'
					+ '<thead>' + header + '</thead>'
					+ '<tbody>' + body + '</tbody>'
					+ '</table>';
			};

			this.renderer.link = function (href, title, text) {
				if ( href.substr(0, 4) != 'http' ) {
					return '<a href ui-sref="docs({path:\'' + href + '\', doc:\'\'})">' + text + '</a>'
				} else {
					return '<a href="' + href + '" target="_blank">' + text + '</a>'
				}
			};

			this.renderer.image = function (href, title, text) {
				var src = href
					.replace('../../../', '/')
					.replace('../../', 'docs/');

				return '<img src="' + src + '" title="' + title + '" alt="' + text + '"/>'
			};

			marked.setOptions({
				renderer: this.renderer,
				gfm: true,
				highlight: function (code) {
					return hljs.highlightAuto(code).value;
				}
			});
		};

		this.headerTree = function(list) {
			var tree = [],
				pointer = -1,
				deferred = $q.defer(),
				promises = [],
				title = '';

			angular.forEach(list, function(el){
				var sdefer = $q.defer();

				promises.push(sdefer.promise);

				if ( (typeof el.id != 'undefined') && (el.id != "") ) {
					if ( (el.localName == 'h1') && (title == '') ) {
						title = el.innerHTML;
					} else if ( el.localName == 'h2' ) {
						pointer++;

						tree[pointer] = {
							id: el.id,
							text: $sce.trustAsHtml(el.innerHTML),
							children: []
						};
					} else if ( el.localName == 'h3' ) {
						tree[pointer].children.push({
							id: el.id,
							text: $sce.trustAsHtml(el.innerHTML)
						});
					}

					sdefer.resolve();
				} else {
					sdefer.resolve();
				}
			});

			$q.all(promises).then(function(item){
				deferred.resolve({
					title: title,
					tree: tree
				});
			});

			return deferred.promise;
		};

		this.getPage = function (path) {
			var deferred = $q.defer();

			if ( typeof this.pages[path] !== 'undefined' ) {
				deferred.resolve(this.pages[path]);
			} else {
				this.downloadPage(path)
					.then(function(page){
						self.pages[path] = page;

						deferred.resolve(page);
					}, function(){
						deferred.resolve(self.errorpage);
					});
			}

			return deferred.promise;
		};

		this.convertMarkdownToPage = function(markdown) {
			var page = {},
				deferred = $q.defer();

			headerid = 0;

			page.sideindex = [];

			marked.parse(
				markdown,
				function(error, parsed) {
					var doc = $compile(parsed)($rootScope);

					page.content = $sce.trustAsHtml(
						angular.element("<p>").append(doc.clone()).html()
					);

					self.headerTree(doc)
						.then(function(tree){
							page.pagetitle = tree.title;
							page.sideindex = tree.tree;

							if ( page.sideindex.length ) {
								page.sideindex.push({
									id: 'comments',
									text: $sce.trustAsHtml('Questions?'),
									children: []
								});
							}

							deferred.resolve(page);
						});
				}
			);

			return deferred.promise;
		};

		this.downloadPage = function(path) {
			var deferred = $q.defer();

			$http.get('/docs/pages/' + path + '.md', {cache: true})
				.success(function(markdown){
					self.convertMarkdownToPage(markdown)
						.then(function(page){
							deferred.resolve(page);
						});
				})
				.error(function() {
					deferred.reject();
				});

			return deferred.promise;
		};

		this.init = function() {
			var deferred = $q.defer();

			this.initRenderer();

			$http.get('docs/index.json')
				.then(function(index){
					self.index = index.data;

					deferred.resolve();
				});

			return deferred.promise;
		}
	}

	DocService.$inject = ['$rootScope', '$http', '$compile', '$q', '$sce'];
	angular.module('aecApp').service('Docs', DocService);

})();

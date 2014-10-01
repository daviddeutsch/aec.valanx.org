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
						templateUrl: 'partials/home.html'
					},
					"background": {
						templateUrl: 'partials/carina.html'
					}
				}
			})

			.state('docs', {
				url: '/docs/{path:.*}',
				views: {
					"main": {
						templateUrl: 'partials/doc.html'
					},
					"background": {
						templateUrl: 'partials/empty.html'
					}
				}
			})

			.state('stats', {
				url: '/stats',
				views: {
					"main": {
						templateUrl: 'partials/stats.html'
					},
					"background": {
						templateUrl: 'partials/empty.html'
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
	function DocCtrl( $window, $scope, $rootScope, $timeout, $state, $stateParams, $aside, $location, Docs, $sce )
	{
		var keepalive,
			id = 0,
			affix,
			pageload;

		$scope.path = '';
		$scope.indexFilter = '';

		$scope.showComments = false;
		$scope.showIndex = false;

		$scope.pages = [];

		var resetSiblings = function() {
			$scope.siblings = {
				previous: { title: '', path: '' },
				next: { title: '', path: '' }
			};
		};

		resetSiblings();

		$scope.pagetitle = '';
		$scope.sideindex = [];

		$scope.docready = true;

		$scope.extended = true;

		var resize = function(start) {
			if ( $window.innerWidth <= 992 ) {
				$scope.extendedPreference = false;
			} else {
				$scope.extended = true;
				$scope.extendedPreference = true;
			}

			if ( typeof affix != 'undefined') {
				affix.$onResize();
			}

			$scope.hoverLeave();
		};

		angular.element($window).bind("resize", function() {
			$timeout(resize, 100);
		});

		if ( typeof $stateParams.path == 'undefined' || $stateParams.path == '' ) {
			$stateParams.path = 'start/welcome';
		}

		$scope.hoverLeave = function() {
			$scope.extended = $scope.extendedPreference;
		};

		$scope.hoverEnter = function() {
			$scope.extended = true;
		};

		$scope.toggleOpen = function() {
			if ( $scope.extended && !$scope.extendedPreference ) {
				$scope.extendedPreference = true;
			} else if ( !$scope.extended && !$scope.extendedPreference ) {
				$scope.extended = true;
			} else {
				$scope.extendedPreference = false;
				$scope.extended = false;
			}
		};

		$scope.switchPage = function(path) {
			if ( !$scope.extendedPreference ) {
				$scope.extended = false;
			}

			if ( $scope.path == path ) {
				$rootScope.loading = false;

				return;
			}

			$scope.showComments = false;
			$scope.showIndex = false;

			$scope.docready = false;

			$scope.path = path;

			$rootScope.loading = true;

			resetSiblings();

			if( $location.path() != "/docs/" + $scope.path ) {
				$location.path("/docs/" + $scope.path);
			}

			angular.element('#disqus_thread').replaceWith('<div id="disqus_thread"><p class="text-center pulse" id="disqus-loading">preparing to load comments...</p></div>');

			Docs.getPage($scope.path)
				.then(function(page){

					$scope.showComments = false;
					$scope.showIndex = false;

					$scope.pagetitle = page.pagetitle;
					$scope.sideindex = page.sideindex;
					$scope.content = $sce.trustAsHtml(page.content);

					$timeout.cancel(pageload);

					pageload = $timeout(function(){
						angular.element('html, body').animate(
							{scrollTop: 0},
							200,
							'easeInOutQuint'
						);

						Docs.pageSiblings($scope.path)
							.then(function(siblings){
								$scope.siblings = siblings;

								$scope.showIndex = $scope.sideindex.length > 0;
							});

						$timeout(function(){
							$rootScope.loading = false;
						}, 40);

						$scope.showComments = ($scope.path != 'start/welcome') && ($scope.path != '');

						$scope.docready = true;
					}, 60);

					// Still have not figured out why .loading = false above "sometimes" fails

				});
		};

		$rootScope.$on(
			'$locationChangeSuccess',
			function(e) {
				var lpath = $location.path();

				if ( lpath.substr(1,4) === "docs" ) {
					if ( lpath.substr(6) !== $scope.path ) {
						$scope.switchPage(lpath.substr(6));
					}
				} else if ( lpath === "/" ) {
					$state.go('home');
				} else {
					aside.hide();

					$state.go(lpath.substr(1));
				}
			});

		var tick = function () {
			$scope.pages.push(Docs.index[id]);

			id++;

			if ( Docs.index.length > id ) {
				keepalive = $timeout(tick, 40);
			} else {
				$scope.switchPage($stateParams.path);
			}
		};

		aside = $aside({
				scope: $scope,
				template: 'partials/doc.aside.html',
				placement: 'left',
				animation: 'am-fade-and-slide-left',
				backdrop: false,
				keyboard: false,
				container: '#background'
			});

		resize(true);

		Docs.init()
			.then(function(){
				keepalive = $timeout(tick, 400);
			});

		$rootScope.$on('backHome', function (event, data) {
			aside.hide();
		});
	}

	DocCtrl.$inject = ['$window', '$scope', '$rootScope', '$timeout', '$state', '$stateParams', '$aside', '$location', 'Docs', '$sce'];
	angular.module('aecApp').controller('DocCtrl', DocCtrl);


	/**
	 * @name StatsCtrl
	 *
	 * @desc Shows Progress
	 */
	function StatsCtrl( $scope, $rootScope, $q, $timeout, Docs )
	{
		$scope.pages = [];

		var pageCompletion = function(page) {
			var deferred = $q.defer();

			page.completion = {
				loaded: false,
				percentage: 100
			};

			$timeout(function(){
				Docs.getPage(page.path)
					.then(function(content){
						var done = 0,
							el = angular.element(content.content ),
							todos = (content.content.match(/TODO/g) || []).length;

						var paragraphs = el.filter("p");

						if ( content.pagetitle != '' ) {
							done = 100 - ( (paragraphs.length / 10) * todos * 5 );
						}

						$timeout(function(){
							page.completion.loaded = true;
							page.completion.percentage = done;
						}, 40);


						deferred.resolve();
					});
			}, 200);


			return deferred.promise;
		};

		var completionIndex = function(index) {
			var deferred = $q.defer(),
				promises = [];

			angular.forEach(index, function(item){
				var sdefer = $q.defer();

				pageCompletion(item)
					.then(function(){
						if ( typeof item.children != 'undefined' ) {
							completionIndex(item.children)
								.then(function(){
									sdefer.resolve();
								});
						} else {
							sdefer.resolve();
						}
					});

				promises.push(sdefer.promise);
			});

			$q.all(promises).then(function(){
				deferred.resolve();
			});

			return deferred.promise;
		};

		// {'progress-bar-info progress-striped active': page.completion.loaded == false, 'progress-bar-success': page.completion.percentage == 100 'progress-bar-warning': page.completion.percentage < 100 && page.completion.percentage > 0 , 'progress-bar-danger': page.completion.percentage == 0}
		$scope.progressBar = function(page) {
			if ( page.completion.loaded == false ) {
				return 'progress-bar-info';
			} else if ( page.completion.percentage < 100 && page.completion.percentage > 0 ) {
				return 'progress-bar-warning';
			} else if ( page.completion.percentage == 0 ) {
				return 'progress-bar-danger';
			} else {
				return 'progress-bar-success';
			}
		};

		Docs.init()
			.then(function(){
				$scope.pages = Docs.index;

				$timeout(function(){
				completionIndex(Docs.index)
					.then(function(){
						$rootScope.loading = false;
					});
				}, 1000);
			});
	}

	StatsCtrl.$inject = ['$scope', '$rootScope', '$q', '$timeout', 'Docs'];
	angular.module('aecApp').controller('StatsCtrl', StatsCtrl);


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
			content: '<h1>404</h1><p>Not Found!</p>'
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
					return '<a href ui-sref="docs({path:\'' + href + '\'})">' + text + '</a>'
				} else {
					return '<a href="' + href + '" target="_blank">' + text + '</a>'
				}
			};

			this.renderer.image = function (href, title, text) {
				var src = href
					.replace('../../../', '')
					.replace('../../', 'docs/');

				return '<img src="' + src + '" alt="' + text + '"/>'
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
						title = el.innerHTML
							.replace('<strong>', '')
							.replace('</strong>', '');
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

		this.pageSiblings = function(path) {
			var deferred = $q.defer(),
				seek = $q.defer(),
				catid = 0;

			angular.forEach(this.index, function(category){
				var childid = 0;

				if ( category.path == path ) {
					seek.resolve([catid, -1]);
				}

				angular.forEach(category.children, function(child){
					if ( child.path == path ) {
						seek.resolve([catid, childid]);
					}

					childid++;
				});

				catid++;
			});

			seek.promise.then(function(res){
				var previous = { title: '', path: '' },
					next = { title: '', path: '' };

				if (res[1] == -1) {
					if ( res[0] > 0 ) {
						previous = self.index[res[0]-1].children[self.index[res[0]-1].children.length-1];
					}

					next = self.index[res[0]].children[res[1]+1];
				} else if (res[1] == 0) {
					previous = self.index[res[0]];

					next = self.index[res[0]].children[res[1]+1];
				} else {
					previous = self.index[res[0]].children[res[1]-1];

					if ( (res[1]+1) < self.index[res[0]].children.length ) {
						next = self.index[res[0]].children[res[1]+1];
					} else {
						next = self.index[res[0]+1];
					}
				}

				deferred.resolve({
					previous: {
						title: previous.title,
						path: previous.path
					},
					next: {
						title: next.title,
						path: next.path
					}
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
					}, function() {
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

					page.content = angular.element("<p>").append(doc.clone()).html();

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

			$http.get('docs/pages/' + path + '.md', {cache: true})
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

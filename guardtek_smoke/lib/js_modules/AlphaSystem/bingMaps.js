/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="https://www.bing.com/api/maps/mapcontrol" />
/*
* File Created: juin 28, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
$(window).on("load", function () {
	(function (window, undefined) {
		// extend Number object with methods for converting degrees/radians
		Number.prototype.toRad = function () { return this * Math.PI / 180; }
		Number.prototype.toDeg = function () { return this * 180 / Math.PI; }

		window.GeoLocationFactory = {
			getNew: function getNew() {
				return {
					map: undefined,
					viewMapBoundsDelta: 1 / 10,
					pushpinCollections: {},
					noPushpinHandler: undefined,
					searchModuleLoaded: false,
					editMode: false,
					drawingTools: undefined,
					polygonUpdateHandler: undefined,
					beginUpdatePolygonHandler: undefined,
					endUpdatePolygonHandler: undefined,
					polygonEditFillColor: new Microsoft.Maps.Color(100, 129, 167, 3),
					polygonEditStrokeColor: new Microsoft.Maps.Color(200, 255, 255, 255),
					polygonCreateFillColor: new Microsoft.Maps.Color(100, 129, 167, 3),
					polygonCreateStrokeColor: new Microsoft.Maps.Color(200, 255, 255, 255),
					destroy: function () { if (this.map) { this.map.dispose(); } },
					init: function (options) {
						var _geoLocationInstance = this;

						var setOptionValue = function (optionName, value) {
							if (!_geoLocationInstance.map) return;
							var opt = _geoLocationInstance.map.getOptions();
							if (!opt) return;

							opt[optionName] = value;
							_geoLocationInstance.map.setView(opt);
						};


						this.setMode = function (mode) {
							_geoLocationInstance.mode = mode;

							Microsoft.Maps.Events.removeHandler(_geoLocationInstance._mapClickHandler);
							Microsoft.Maps.Events.removeHandler(_geoLocationInstance._mapMoveHandler);
							Microsoft.Maps.Events.removeHandler(_geoLocationInstance._mapKeyPressHandler);
							Microsoft.Maps.Events.removeHandler(_geoLocationInstance._mapDoubleClickHandler);
							Microsoft.Maps.Events.removeHandler(_geoLocationInstance._mapTypeUpdatedHandler);
							var offset;
							if (_geoLocationInstance.popupOffsetX !== undefined && _geoLocationInstance.popupOffsetY !== undefined) {
								offset = new Microsoft.Maps.Point(_geoLocationInstance.popupOffsetX, _geoLocationInstance.popupOffsetY)
							}
							else {
								offset = new Microsoft.Maps.Point(0, 30)
							}

							_geoLocationInstance.infobox.pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Point(0, 0), {
								visible: false,
								maxWidth: 300,
								maxHeight: 400,
								offset: offset
							});
							_geoLocationInstance.infobox.pinInfobox.setMap(_geoLocationInstance.map);


							_geoLocationInstance.infobox.pinInfoboxAction = new Microsoft.Maps.Infobox(new Microsoft.Maps.Point(0, 0), {
								visible: false,
								maxWidth: 300,
								maxHeight: 400,
								offset: offset
							});
							_geoLocationInstance.infobox.pinInfoboxAction.setMap(_geoLocationInstance.map);

							//check the map type
							if (_geoLocationInstance.mapTypeUpdatedHandler) {
								_geoLocationInstance._mapTypeUpdatedHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'maptypechanged', _geoLocationInstance.mapTypeUpdatedHandler);
							}
						};

						var _findAddressInternal = function (address, handler) {
							var search = new Microsoft.Maps.Search.SearchManager(_geoLocationInstance.map);
							search.geocode({ where: address, count: 1, callback: function (r, d) {
								if (r.results.length > 0 && r.results[0] != undefined)
									handler(r.results[0].location);
								else
									handler(null);
							}
							});
						};


						this.findAddress = function (address, handler) {
							if (!_geoLocationInstance.searchModuleLoaded) {
								Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: function () { _geoLocationInstance.searchModuleLoaded = true; _findAddressInternal(address, handler); } });
							} else {
								_findAddressInternal(address, handler);
							}
						};

						this.hasPushpins = function () {
							for (var _prop in _geoLocationInstance.pushpinCollections) {
								if (_geoLocationInstance.pushpinCollections.hasOwnProperty(_prop)) {
									return true;
								}
							}
							return false;
						};

						this.addLine = function (startLat, startLong, endLat, endLong, name) {
							var start = new Microsoft.Maps.Location(startLat, startLong);
							var end = new Microsoft.Maps.Location(endLat, endLong);

							if (!_geoLocationInstance.pushpinCollections[name]) {

								_geoLocationInstance.pushpinCollections[name] = new Microsoft.Maps.Layer();
								_geoLocationInstance.map.layers.insert(_geoLocationInstance.pushpinCollections[name]);
							}

							if (_geoLocationInstance.map.getMapTypeId() === "a") {
								color = new Microsoft.Maps.Color(255, 255, 255, 255)
							}
							else {
								color = new Microsoft.Maps.Color(255, 90, 90, 90)
							}
							color = new Microsoft.Maps.Color(255, 0, 181, 255);
							var polyline = new Microsoft.Maps.Polyline([start, end], { strokeColor: color, strokeThickness: 3 });
							_geoLocationInstance.pushpinCollections[name].add(polyline);
						};

						this.addPolygon = function (polygon, name) {
							if (polygon && polygon.length > 0) {
								if (!_geoLocationInstance.pushpinCollections[name]) {
									_geoLocationInstance.pushpinCollections[name] = new Microsoft.Maps.Layer();
									_geoLocationInstance.map.layers.insert(_geoLocationInstance.pushpinCollections[name]);
								}
								var _polygonOptions = {
									fillColor: new Microsoft.Maps.Color(100, 129, 167, 3),
									strokeColor: new Microsoft.Maps.Color(255, 129, 167, 3),
									strokeThickness: 2,
									strokeDashArray: '2 2'
								};
								var _polygon = new Microsoft.Maps.Polygon(polygon, _polygonOptions);
								_geoLocationInstance.pushpinCollections[name].add(_polygon);
								_geoLocationInstance.setBoundsMapView();
							}
						};
						this.addPushpin = function (pushpin, name, setViewMap, zIndex) {
							var pushpins = [];
							pushpins.push(pushpin);
							this.addPushpins(pushpins, name, setViewMap, zIndex);
						};
						this.setZoom = function (zoomLevel) {
							setOptionValue('zoom', zoomLevel);
						};
						this.setMapType = function (mapType) {
							if (!_geoLocationInstance.map) return;
							_geoLocationInstance.map.setMapType(mapType);
						};
						this.clear = function (layerName) {
							var layer = _geoLocationInstance.pushpinCollections[layerName];
							if (layer) {
								layer.clear();
								_geoLocationInstance.map.layers.remove(layer);
							}
						};
						this.toogleClustering = function (layerName, enableClustering) {
							if (!_geoLocationInstance.pushpinCollections[layerName]) return;
							_geoLocationInstance.pushpinCollections[layerName].setOptions({ clusteringEnabled: enableClustering });
						};
						this.addPushpins = function (pushPinArray, name, ensureVisible, zIndex) {
							if (!zIndex)
								zIndex = 0;
							ensureVisible = typeof ensureVisible !== 'undefined' ? ensureVisible : true;
							if (!_geoLocationInstance.pushpinCollections[name]) {
								_geoLocationInstance.pushpinCollections[name] = new Microsoft.Maps.Layer();
								_geoLocationInstance.pushpinCollections[name].setZIndex(zIndex);
								_geoLocationInstance.map.layers.insert(_geoLocationInstance.pushpinCollections[name]);
							}
							var _locs = [];
							for (var i = 0; i < pushPinArray.length; i++) {
								var pin = pushPinArray[i];
								if (pin instanceof _geoLocationInstance.type.Pushpin) {
									var _loc = new Microsoft.Maps.Location(pin.Location.Latitude, pin.Location.Longitude);
									_locs.push(_loc);
									var _pinOptions = {
										text: pin.Number,
										typeName: 'pushpin'
									};

									if (pin.Icon instanceof _geoLocationInstance.type.Icon) {
										_pinOptions.icon = pin.Icon.Url;
										//										_pinOptions.width = pin.Icon.Width;
										//										_pinOptions.height = pin.Icon.Height;
										//_pinOptions.textOffset = new Microsoft.Maps.Point(pin.Icon.TextOffsetX, pin.Icon.TextOffsetY);

									}

									var _pin = new Microsoft.Maps.Pushpin(_loc, _pinOptions);
									_pin.metadata = pin.Id;
									_pin.Title = pin.Title;
									_pin.Description = pin.Description;
									_pin.Actions = pin.Actions;
									if (pin.HasInfobox) {
										if (_pin.Actions.length > 0) {
											Microsoft.Maps.Events.addHandler(_pin, 'mouseover', _geoLocationInstance.infobox.displayActionInfobox);
										}
										else {
											Microsoft.Maps.Events.addHandler(_pin, 'mouseover', _geoLocationInstance.infobox.displayInfobox);
										}
									}
									_geoLocationInstance.pushpinCollections[name].add(_pin);
								}
							}
							if (ensureVisible == true)
								_geoLocationInstance.setBoundsMapView();
						};

						this.makePushpin = function (data) {
							var options = data.Pushpin || data.pushpin || data._pushpin || data;

							if (!data._LatLong && !(data.Longitude && data.Latitude)) {
								return null;
							}
							var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(data.Latitude, data.Longitude), {
								icon: options.icon,
								text: options.overlayText,
								textOffset: new Microsoft.Maps.Point(-4, 2),
								anchor: options.iconAnchor ? new Microsoft.Maps.Point(options.iconAnchor.x, options.iconAnchor.y) : new Microsoft.Maps.Point(0, 0),
								typeName: options.pushpinClass,
								title: options.title,
								description: options.description
							});
							pin.metadata = data;
							pin.Title = options.infoboxTitle;
							pin.Actions = options.actions || [];

							if (options.onClick) {
								var clickHandler = options.onClick;
								Microsoft.Maps.Events.addHandler(pin, 'click', function (e) { return clickHandler(data, e); });
							}
							if (options.hasInfobox) {
								if (pin.Actions.length > 0) {
									Microsoft.Maps.Events.addHandler(pin, 'mouseover', _geoLocationInstance.infobox.displayActionInfobox);
								}
								else {
									Microsoft.Maps.Events.addHandler(pin, 'mouseover', _geoLocationInstance.infobox.displayInfobox);
								}

								Microsoft.Maps.Events.addHandler(pin, 'mouseout', _geoLocationInstance.infobox.hideInfobox);
							}

							return pin;
						};

						this.addClusteredPushpins = function (pushPinArray, name, clusterIcons, ensureVisible, zIndex) {
							var clusteredEntity_ClusterNeeded = function (clusteredPin) {
								var pushpinOptions = {};
								if (clusteredPin.containedPushpins.length > 0) {
									var data = clusteredPin.containedPushpins[0].metadata;
									var options = data.Pushpin || data.pushpin || data._pushpin || data;

									if (options.getPushpinOptions)
										pushpinOptions = options.getPushpinOptions(clusteredPin.containedPushpins) || {};
								}
								clusteredPin.setOptions({
									icon: pushpinOptions.icon || (pushpinOptions.overlayText != '' ? clusterIcons.iconWithText : clusterIcons.icon),
									anchor: pushpinOptions.iconAnchor ? pushpinOptions.iconAnchor : (pushpinOptions.overlayText != '' ? new Microsoft.Maps.Point(clusterIcons.iconWithTextAnchor.x, clusterIcons.iconWithTextAnchor.y) : new Microsoft.Maps.Point(clusterIcons.iconAnchor.x, clusterIcons.iconAnchor.y)),
									text: pushpinOptions.overlayText,
									textOffset: new Microsoft.Maps.Point(-4, 2),
									typeName: pushpinOptions.pushpinClass,
									title: pushpinOptions.title,
									description: pushpinOptions.description
								});
								clusteredPin.Title = pushpinOptions.infoboxTitle;
								clusteredPin.Description = pushpinOptions.infoboxDescription;
								clusteredPin.Actions = pushpinOptions.actions || [];

								Microsoft.Maps.Events.addHandler(clusteredPin, 'mouseover', _geoLocationInstance.infobox.displayInfobox);
								Microsoft.Maps.Events.addHandler(clusteredPin, 'mouseout', _geoLocationInstance.infobox.hideInfobox);
							};


							ensureVisible = typeof ensureVisible !== 'undefined' ? ensureVisible : true;
							if (!_geoLocationInstance.pushpinCollections[name]) {
								_geoLocationInstance.pushpinCollections[name] = new Microsoft.Maps.ClusterLayer([], { clusteredPinCallback: clusteredEntity_ClusterNeeded });
								_geoLocationInstance.map.layers.insert(_geoLocationInstance.pushpinCollections[name]);
							}
							_geoLocationInstance.pushpinCollections[name].setZIndex(zIndex);
							var pins = [];
							for (var i = 0; i < pushPinArray.length; i++) {
								var pin = _geoLocationInstance.makePushpin(pushPinArray[i])
								if (pin) {
									pins.push(pin);
								}
							}
							_geoLocationInstance.pushpinCollections[name].setPushpins(pins);
							if (ensureVisible == true)
								_geoLocationInstance.setBoundsMapView();
						};


						this.getPushpin = function (index, collectionName) {
							if (!_geoLocationInstance.pushpinCollections[collectionName] || index > _geoLocationInstance.pushpinCollections[collectionName].getPrimitives().length)
								return undefined;
							return _geoLocationInstance.pushpinCollections[collectionName].getPrimitives()[index];
						};
						this.getPushpinIndex = function (collectionName, location) {
							if (!_geoLocationInstance.pushpinCollections[collectionName])
								return undefined;
							return _geoLocationInstance.pushpinCollections[collectionName].getIndex(location);
						};

						this.setEditMode = function (enable, polygons) {
							_geoLocationInstance.editMode = enable;
							var _polygonOptions = {
								fillColor: new Microsoft.Maps.Color(100, 129, 167, 3),
								strokeColor: new Microsoft.Maps.Color(255, 129, 167, 3),
								strokeThickness: 2,
								strokeDashArray: '2 2'
							};
							_geoLocationInstance.clear('geofence', false);
							if (_geoLocationInstance.editMode) {
								_geoLocationInstance.cleanDrawingMode();
								Microsoft.Maps.loadModule('Microsoft.Maps.DrawingTools', function () {
									_geoLocationInstance.drawingTools = new Microsoft.Maps.DrawingTools(_geoLocationInstance.map);
									Microsoft.Maps.Events.addHandler(_geoLocationInstance.drawingTools, 'drawingChanged', function (shape) {
										if (_geoLocationInstance.polygonUpdateHandler) {
											_geoLocationInstance.polygonUpdateHandler.apply(_geoLocationInstance, shape.getRings());
										}
									});
									if (polygons && polygons.length > 0) {
										var polygon = new Microsoft.Maps.Polygon(polygons, _polygonOptions);
										_geoLocationInstance.drawingTools.edit(polygon);
									}
									else {
										_geoLocationInstance.map.getRootElement().style.cursor = 'crosshair';
										_geoLocationInstance.drawingTools.create(Microsoft.Maps.DrawingTools.ShapeType.polygon);
									}
								});
							}
							else {
								_geoLocationInstance.map.getRootElement().style.cursor = 'auto';
								_geoLocationInstance.cleanDrawingMode();
								if (polygons && polygons.length > 0) {
									_geoLocationInstance.addPolygon(polygons, 'geofence');
								}
							}
						};

						this.cleanDrawingMode = function () {
							if (_geoLocationInstance.drawingTools) {
								_geoLocationInstance.drawingTools.dispose();
								_geoLocationInstance.drawingTools = undefined;
							}
						}

						this.setMapCenter = function (longitude, latitude) {
							_geoLocationInstance.map.setView({
								center: new Microsoft.Maps.Location(longitude, latitude),
								zoom: 18
							});
						};

						var _getLocations = function (item) {
							var _locations = [];
							if (item instanceof Microsoft.Maps.Pushpin) {
								_locations.push(item.getLocation());
							}
							else if (item instanceof Microsoft.Maps.Polygon) {
								_locations = _locations.concat(item.getLocations());
							}
							else if (item instanceof Microsoft.Maps.Layer) {
								for (var _i = 0; _i < item.getPrimitives().length; _i++) {
									_locations = _locations.concat(_getLocations(item.getPrimitives()[_i]));
								}
							}
							else if (item === _geoLocationInstance.map.layers) {
								for (var _i = 0; _i < item.length; _i++) {
									_locations = _locations.concat(_getLocations(item[_i]));
								}
							}
							return _locations;
						};

						this.setBoundsMapView = function () {
							if (!_geoLocationInstance.map) return;
							var _locations = _getLocations(_geoLocationInstance.map.layers);
							if (_locations.length) {
								if (_locations.length > 1) {
									var _bounds = Microsoft.Maps.LocationRect.fromLocations(_locations);
									// Add 1/10 of open view so pushpins are not on corners of map
									_bounds.height += _bounds.height * _geoLocationInstance.viewMapBoundsDelta;
									_bounds.width += _bounds.width * _geoLocationInstance.viewMapBoundsDelta;
									_geoLocationInstance.map.setView({
										bounds: _bounds
									});
								}
								else {
									_geoLocationInstance.map.setView({
										center: _locations[0], zoom: 18
									});
								}
							}
							else {
								_geoLocationInstance.map.setView({
									center: new Microsoft.Maps.Location(0, 0),
									zoom: 1
								});
							}
						};
						this.show = function (name) {
							if (_geoLocationInstance.pushpinCollections[name])
								_geoLocationInstance.pushpinCollections[name].setVisible(true);
						};

						this.hide = function (name) {
							if (_geoLocationInstance.pushpinCollections[name]) {
								_geoLocationInstance.pushpinCollections[name].setVisible(false);
							}
						};

						this.clear = function (name, ensureVisible) {
							if (!_geoLocationInstance.map) return;
							ensureVisible = typeof ensureVisible !== 'undefined' ? ensureVisible : true;
							if (!name) {
								for (prop in _geoLocationInstance.pushpinCollections) {
									_geoLocationInstance.pushpinCollections[prop].clear();
								}
							}
							else {
								if (_geoLocationInstance.pushpinCollections.hasOwnProperty(name)) {
									_geoLocationInstance.pushpinCollections[name].clear();

								}
							}
							if (ensureVisible == true)
								_geoLocationInstance.setBoundsMapView();
							_geoLocationInstance.infobox.hideInfobox();
						};

						this.getBounds = function () {
							return _geoLocationInstance.map.getBounds();
						};

						this.getBoundsRect = function () {
							var locationRect = this.getBounds();
							return {
								top: locationRect.getNorth(),
								right: locationRect.getEast(),
								bottom: locationRect.getSouth(),
								left: locationRect.getWest()
							};
						};


						this.infobox = {
							pinInfobox: undefined,
							pinInfoboxAction: undefined,
							getLocationIndex: function (collectionName, location) {
								return _geoLocationInstance.getPushpinIndex(collectionName, location);
							},
							showInfoBox: function (index, collectionName) {
								var _pin = _geoLocationInstance.getPushpin(index, collectionName);
								if (_pin) {
									Microsoft.Maps.Events.invoke(_pin, 'mouseover', { target: _pin });
								}
							},
							displayActionInfobox: function (e) {
								var _event = this;
								var _actions = [];
								var _desc = typeof e.target.Description !== 'undefined' ? e.target.Description : ' ';
								if (e.target.Actions.length > 0) {
									_actions = [];
									for (var _i = 0; _i < e.target.Actions.length; _i++) {
										var _action = e.target.Actions[_i];
										_actions.push({
											label: _action.label,
											eventHandler: function (ev) {
												_action.eventHandler.call(ev, e);
											}
										});
									}
								}
								_geoLocationInstance.infobox.pinInfobox.setOptions({
									visible: false
								});
								_geoLocationInstance.infobox.pinInfoboxAction.setOptions({
									title: e.target.Title,
									description: _desc,
									actions: _actions,
									visible: true
								});
								_geoLocationInstance.infobox.pinInfoboxAction.setLocation(e.target.getLocation());
							},
							displayInfobox: function (e) {
								var _event = this;
								var _desc = typeof e.target.Description !== 'undefined' ? e.target.Description : ' ';
								_geoLocationInstance.infobox.pinInfoboxAction.setOptions({
									visible: false
								});
								_geoLocationInstance.infobox.pinInfobox.setOptions({
									title: e.target.Title,
									description: _desc,
									visible: true
								});
								_geoLocationInstance.infobox.pinInfobox.setLocation(e.target.getLocation());
							},
							hideInfobox: function () {
								var _event = this;
								_geoLocationInstance.infobox.pinInfobox.setOptions({
									visible: false
								});
								_geoLocationInstance.infobox.pinInfoboxAction.setOptions({
									visible: false
								});
							}
						};


						//						this.pushpinEdition = {
						//							_earthRadius: 6367,
						//							_inProcess: false,
						//							_isCreatingPolygon: false,
						//							_isEditingPolygon: false,
						//							_ctrlKey: false,
						//							_onMouseOverPushpin: false,
						//							_currentLocation: undefined,
						//							_editLayer: undefined,
						//							_dragHandleLayer: undefined,
						//							_mapKeyPressHandler: undefined,
						//							_mapKeyDownHandler: undefined,
						//							_mapMoveHandler: undefined,
						//							_mapClickHandler: undefined,
						//							_mapDoubleClickHandler: undefined,
						//							_editShape: undefined,
						//							_shape: undefined,
						//							_maskLine: undefined,
						//							_pointIndex: undefined,
						//							_points: [],
						//							_editPoints: [],
						//							_maskPoints: [],
						//							_dragHandleMdlLine: undefined,
						//							_options: {
						//								polygonIcon: rootBase + 'Content/img/maps/polygonIcon.png',                         // Icon for polygon
						//								polygonActiveIcon: rootBase + 'Content/img/maps/polygonActiveIcon.png',             // Active icon for polygon
						//								polygonHoverIcon: rootBase + 'Content/img/maps/polygonHoverIcon.png',               // Hover icon for polygon
						//								shapeMaskFillColor: new Microsoft.Maps.Color(100, 129, 167, 3),                     // fill color of shape mask in editing mode
						//								shapeMaskStrokeColor: new Microsoft.Maps.Color(200, 255, 255, 255),                 // Line color of shape mask in editing mode
						//								shapeMaskStrokeThickness: 2,                                                        // line width of shape mask
						//								shapeMaskStrokeDashArray: '2 2',                                                    // dash pattern of shape mask
						//								maskStrokeColor: new Microsoft.Maps.Color(200, 255, 255, 255),                      // Line color of shape mask in creating mode
						//								maskStrokeThickness: 2,                                                             // line width of shape mask
						//								maskStrokeDashArray: '2 2',                                                         // dash pattern of shape mask
						//								shapeStrokeColor: new Microsoft.Maps.Color(255, 129, 167, 3),                       // Line color of shape
						//								shapeFillColor: new Microsoft.Maps.Color(100, 129, 167, 3),                         // fill color of shape (polygon only)
						//								shapeStrokeThickness: 2,                                                            // line width of shape
						//								shapeStrokeDashArray: '2 2',                                                        // dash pattern of shape
						//								dragHandleImage: rootBase + 'Content/img/maps/DragHandleWhite.png',                 // Image for default drag handle
						//								dragHandleImageActive: rootBase + 'Content/img/maps/DragHandleGreen.png',           // Image for active drag handle
						//								dragHandleImageHeight: 10,                                                          // Height for default and active drag handle image
						//								dragHandleImageWidth: 10,                                                           // Width for default and active drag handle image
						//								dragHandleImageAnchor: new Microsoft.Maps.Point(5, 5),                              // Anchor Point for drag handle image
						//								dragHandleMdlLineImage: rootBase + 'Content/img/maps/DragHandleMdlLineWhite.png',   // Image for drag handle in middle of line
						//								dragHandleMdlLineImageActive: rootBase + 'Content/img/maps/DragHandleWhite.png',    // Image for active drag handle in middle of line
						//								dragHandleMdlLineImageHeight: 10,                                                   // Height for default and active drag handle image in middle of line
						//								dragHandleMdlLineImageWidth: 10,                                                    // Width for default and active drag handle image in middle of line
						//								dragHandleMdlLineImageAnchor: new Microsoft.Maps.Point(5, 5)                        // Anchor Point for drag handle image in middle of line
						//							},
						//							editShape: function () {
						//								var _that = this;
						//								_that.edit(_that._shape);
						//							},
						//							deleteShape: function () {
						//								var _that = this;
						//								_that._deleteShape();
						//								if (_geoLocationInstance.polygonUpdateHandler)
						//									_geoLocationInstance.polygonUpdateHandler.apply(_that, [_that._points]);
						//							},
						//							setEditPolygon: function (points) {
						//								var _that = this;

						//								_that._deleteShape();
						//								for (var i = 0; i < points.length; i++) {
						//									_that._points.push(new Microsoft.Maps.Location(points[i].latitude, points[i].longitude));
						//								}
						//								var opt = {
						//									strokeColor: _geoLocationInstance.polygonCreateStrokeColor,
						//									strokeThickness: _that._options.shapeStrokeThickness,
						//									strokeDashArray: _that._options.shapeStrokeDashArray,
						//									fillColor: _geoLocationInstance.polygonCreateFillColor
						//								};
						//								_that._shape = new Microsoft.Maps.Polygon(_that._points, opt);
						//								if (!_that._editLayer) {
						//									_that._editLayer = new Microsoft.Maps.Layer();
						//									_geoLocationInstance.map.layers.insert(_that._editLayer);
						//								}
						//								_that._editLayer.add(_that._shape);
						//								_geoLocationInstance.setBoundsMapView();
						//							},
						//							_deleteShape: function () {
						//								var _that = this;

						//								if (_that._editLayer) {
						//									_that._editLayer.remove(_that._shape);
						//									_that._editLayer.remove(_that._editShape);
						//									_that._editShape = undefined;
						//								}
						//								_that._editPoints = [];
						//								_that._shape = undefined;
						//								_that._points = [];
						//							},
						//							_editDispose: function (reset) {
						//								var _that = this;

						//								if (_that._isEditingPolygon) {
						//									if (reset)
						//										_that._deleteShape();

						//									Microsoft.Maps.Events.removeHandler(_that._mapKeyPressHandler);
						//									Microsoft.Maps.Events.removeHandler(_that._mapKeyDownHandler);
						//									_geoLocationInstance.map.getRootElement().onkeyup = null;
						//									_geoLocationInstance.map.getRootElement().onkeydown = null;
						//									_geoLocationInstance.map.entities.remove(_that._dragHandleLayer);
						//									_that._dragHandleLayer = null;
						//									_that._editShape = null;

						//									if (_geoLocationInstance.polygonUpdateHandler)
						//										_geoLocationInstance.polygonUpdateHandler.apply(_that, [_that._points]);

						//									_that.edit.handled = true;
						//									_that.isEditingPolygon = false;
						//								}
						//							},
						//							_setMouseCursor: function (val) {
						//								var _that = this;
						//								_geoLocationInstance.map.getRootElement().style.cursor = val;
						//							},
						//							_getColorFromCssColor: function (input) {
						//								var m;

						//								m = input.match(/^#([0-9a-f]{4})$/i);
						//								if (m)
						//									return new Microsoft.Maps.Color(parseInt(m[1].charAt(3), 16) * 0x11, parseInt(m[1].charAt(0), 16) * 0x11, parseInt(m[1].charAt(1), 16) * 0x11, parseInt(m[1].charAt(2), 16) * 0x11);
						//								m = input.match(/^#([0-9a-f]{3})$/i);
						//								if (m)
						//									return new Microsoft.Maps.Color(255, parseInt(m[1].charAt(0), 16) * 0x11, parseInt(m[1].charAt(1), 16) * 0x11, parseInt(m[1].charAt(2), 16) * 0x11);
						//								m = input.match(/^#([0-9a-f]{8})$/i);
						//								if (m)
						//									return new Microsoft.Maps.Color(parseInt(m[1].substr(6, 2), 16), parseInt(m[1].substr(0, 2), 16), parseInt(m[1].substr(2, 2), 16), parseInt(m[1].substr(4, 2), 16));
						//								m = input.match(/^#([0-9a-f]{6})$/i);
						//								if (m)
						//									return new Microsoft.Maps.Color(255, parseInt(m[1].substr(0, 2), 16), parseInt(m[1].substr(2, 2), 16), parseInt(m[1].substr(4, 2), 16));
						//								m = input.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+\.\d+)\s*\)$/i);
						//								if (m)
						//									return new Microsoft.Maps.Color(255 * m[4], m[1], m[2], m[3]);
						//								m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
						//								if (m)
						//									return new Microsoft.Maps.Color(255, m[1], m[2], m[3]);
						//								return null;
						//							},
						//							_dispose: function () {
						//								var _that = this;

						//								if (_that._isCreatingPolygon) {
						//									if (_that._shape && (_that._shape.toString() == '[Polygon]' || _that._editShape.toString() == '[AdvancedShapes.Polygon]')) {
						//										//fix for FireFox double click event issue
						//										if (_that._points.length > 1 && _that._points[_that._points.length - 1].toString() == _that._points[_that._points.length - 2].toString()) {
						//											_that._points.pop();
						//										}

						//										_that._points.push(_that._points[0]);
						//										_that._shape.setLocations(_that._points);
						//									}

						//									_that._editLayer.remove(_that._maskLine);
						//									_that._editLayer.dispose();
						//									_geoLocationInstance.map.layers.clear();
						//									//_that._shape = null;
						//									_that._setMouseCursor('auto');

						//									Microsoft.Maps.Events.removeHandler(_that._mapClickHandler);
						//									Microsoft.Maps.Events.removeHandler(_that._mapMoveHandler);
						//									Microsoft.Maps.Events.removeHandler(_that._mapKeyPressHandler);
						//									Microsoft.Maps.Events.removeHandler(_that._mapKeyDownHandler);
						//									Microsoft.Maps.Events.removeHandler(_that._mapDoubleClickHandler);

						//									if (_geoLocationInstance.polygonUpdateHandler)
						//										_geoLocationInstance.polygonUpdateHandler.apply(_that, [_that._points]);

						//									if (_geoLocationInstance.endUpdatePolygonHandler)
						//										_geoLocationInstance.endUpdatePolygonHandler();
						//									_that.edit.handled = true;
						//									_that._isCreatingPolygon = false;
						//								}
						//							},
						//							_init: function () {
						//								var _that = this;
						//								if (_that._isEditingPolygon) {
						//									_that._editDispose(true);
						//								}
						//								_that._isCreatingPolygon = true;
						//								if (!_that._editLayer) {
						//									_that._editLayer = new Microsoft.Maps.Layer();
						//									_geoLocationInstance.map.layers.insert(_that._editLayer);
						//								}
						//								_that._editLayer.clear();
						//								//Wire initial events to Map
						//								_that._mapDoubleClickHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'dblclick', _that._doubleClickHandler);
						//								_that._mapClickHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'click', _that._mapMouseDownHandler);
						//								_that._mapKeyPressHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'keyup', _that._keyPressHandler);

						//								_that._setMouseCursor("crosshair");
						//								_that._maskPoints = [new Microsoft.Maps.Location(0, 0), new Microsoft.Maps.Location(0, 0)];
						//								_that._maskLine = new Microsoft.Maps.Polyline(_that._maskPoints, {
						//									strokeColor: _that._options.maskStrokeColor,
						//									strokeThickness: _that._options.maskStrokeThickness,
						//									strokeDashArray: _that._options.maskStrokeDashArray
						//								});
						//								_that._points = [];
						//							},
						//							_initEdit: function () {
						//								var _that = this;
						//								if (_that._isCreatingPolygon) {
						//									_that._dispose();
						//								}
						//								_that._isEditingPolygon = true;
						//								//Get shape points
						//								_that._editPoints = [];
						//								_that._editPoints = _that._editShape.getLocations();

						//								if (_that._dragHandleLayer != null) {
						//									_geoLocationInstance.map.entities.remove(_that._dragHandleLayer);
						//									_that._dragHandleLayer = null;
						//								}

						//								//Entity Collection for Drag Hanldes
						//								_that._dragHandleLayer = new Microsoft.Maps.EntityCollection()

						//								var opt = {
						//									fillColor: _geoLocationInstance.polygonEditFillColor,
						//									strokeColor: _geoLocationInstance.polygonEditStrokeColor,
						//									strokeThickness: _that._options.shapeMaskStrokeThickness,
						//									strokeDashArray: _that._options.shapeMaskStrokeDashArray
						//								};

						//								//Build Shape Mask
						//								_that._shapeMask = new Microsoft.Maps.Polygon(_that._editPoints, opt);

						//								//Add drag handles and wire events
						//								var lenOffset = 1
						//								if (_that._editShape.geometryType === 3) {
						//									lenOffset = 2
						//								}

						//								opt = {
						//									draggable: true,
						//									icon: _that._options.dragHandleImage,
						//									height: _that._options.dragHandleImageHeight,
						//									width: _that._options.dragHandleImageWidth,
						//									anchor: _that._options.dragHandleImageAnchor,
						//									typeName: 'BM_Shape_DragHandle'
						//								};

						//								for (i = 0; i <= (_that._editPoints.length - lenOffset); i++) {
						//									var _dragHandle = new Microsoft.Maps.Pushpin(_that._editPoints[i], opt);
						//									_that._addDragHandleEvents(_dragHandle);
						//									_that._dragHandleLayer.push(_dragHandle);
						//								}
						//								_that._dragHandleMdlLine = new Microsoft.Maps.EntityCollection(),
						//                            opt = {
						//                            	draggable: false,
						//                            	icon: _that._options.dragHandleMdlLineImage,
						//                            	height: _that._options.dragHandleMdlLineImageHeight,
						//                            	width: _that._options.dragHandleMdlLineImageWidth,
						//                            	anchor: _that._options.dragHandleMdlLineImageAnchor,
						//                            	typeName: 'BM_Shape_DragMdlLineHandle'
						//                            };

						//								var _savePoint = _that._editPoints[0];
						//								for (i = 1; i <= _that._editPoints.length - 1; i++) {
						//									var _dragMdlLineHandle = new Microsoft.Maps.Pushpin(_that._getMiddlePoint(_savePoint, _that._editPoints[i]), opt);
						//									_that._addDragHandleMdlLineEvents(_dragMdlLineHandle);
						//									_that._dragHandleMdlLine.push(_dragMdlLineHandle);
						//									_savePoint = _that._editPoints[i];
						//								}

						//								_that._dragHandleLayer.push(_that._dragHandleMdlLine);
						//								_that._dragHandleLayer.push(_that._shapeMask);

						//								//Add Drag Handles/Mask to Map
						//								_geoLocationInstance.map.entities.push(_that._dragHandleLayer);

						//								//Keypress event to exit
						//								if (_that._mapKeyPressHandler) {
						//									Microsoft.Maps.Events.removeHandler(_that._mapKeyPressHandler);
						//								}
						//								if (_that._mapKeyDownHandler) {
						//									Microsoft.Maps.Events.removeHandler(_that._mapKeyDownHandler);
						//								}
						//								_that._mapKeyPressHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'keyup', _that._editKeyPressHandler);
						//								_that._mapKeyDownHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'keydown', _that._editKeyDownHandler);
						//								_geoLocationInstance.map.getRootElement().onkeyup = _that._editKeyPressHandler; //Need to use Javascript onkeyup to be captured
						//								_geoLocationInstance.map.getRootElement().onkeydown = _that._editKeyDownHandler; //Need to use Javascript onkeydown to be captured
						//							},
						//							_addDragHandleEvents: function (dragHandle) {
						//								var _that = this;
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'dragstart', _that._startDragHandler);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'drag', _that._dragHandler);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'dragend', _that._endDragHandler);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'mouseover', _that._mouseOverDragHandle);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'mouseout', _that._mouseOutDragHandle);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'click', _that._pushpinClickHandler);
						//							},
						//							_addDragHandleMdlLineEvents: function (dragHandle) {
						//								var _that = this;
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'click', _that._newPushpinClickHandler);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'mouseover', _that._mouseOverDragHandleMdlLine);
						//								Microsoft.Maps.Events.addHandler(dragHandle, 'mouseout', _that._mouseOutDragHandleMdlLine);
						//							},
						//							_newPushpinClickHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								var _pushpinIndex = undefined;
						//								var _handleLocation = e.target.getLocation();

						//								//Determine point index
						//								for (i = 0; i <= (_that._dragHandleMdlLine.getLength() - 1); i++) {
						//									if (_handleLocation == _that._dragHandleMdlLine.get(i).getLocation()) {
						//										_pushpinIndex = i;
						//										break;
						//									}
						//								}
						//								_that._editPoints.splice(_pushpinIndex + 1, 0, _handleLocation);
						//								_that._dragHandleMdlLine.get(_pushpinIndex).setLocation(_that._getMiddlePoint(_that._editPoints[_pushpinIndex], _that._editPoints[_pushpinIndex + 1]));

						//								var opt = {
						//									draggable: false,
						//									icon: _that._options.dragHandleMdlLineImage,
						//									height: _that._options.dragHandleMdlLineImageHeight,
						//									width: _that._options.dragHandleMdlLineImageWidth,
						//									anchor: _that._options.dragHandleMdlLineImageAnchor,
						//									typeName: 'BM_Shape_DragMdlLineHandle'
						//								};
						//								var _dragMdlLineHandle = new Microsoft.Maps.Pushpin(_that._getMiddlePoint(_that._editPoints[_pushpinIndex + 1], _that._editPoints[_pushpinIndex + 2]), opt);
						//								_that._addDragHandleMdlLineEvents(_dragMdlLineHandle);
						//								_that._dragHandleMdlLine.insert(_dragMdlLineHandle, _pushpinIndex + 1);

						//								_that._shapeMask.setLocations(_that._editPoints);
						//								_that._editShape.setLocations(_that._editPoints);

						//								opt = {
						//									draggable: true,
						//									icon: _that._options.dragHandleImage,
						//									height: _that._options.dragHandleImageHeight,
						//									width: _that._options.dragHandleImageWidth,
						//									anchor: _that._options.dragHandleImageAnchor,
						//									typeName: 'BM_Shape_DragHandle'
						//								};
						//								var _dragHandle = new Microsoft.Maps.Pushpin(_handleLocation, opt);
						//								_that._addDragHandleEvents(_dragHandle);

						//								_that._dragHandleLayer.insert(_dragHandle, _pushpinIndex + 1);

						//								e.handled = true;
						//							},
						//							_getMiddlePoint: function (startLocation, endLocation) {
						//								var _that = this;
						//								var _lat = (startLocation.latitude + endLocation.latitude) / 2;
						//								var _long = (startLocation.longitude + endLocation.longitude) / 2;
						//								return new Microsoft.Maps.Location(_lat, _long);
						//							},
						//							_startDragHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								var handleLocation = e.entity.getLocation();

						//								//Determine point index
						//								for (i = 0; i <= (_that._editPoints.length - 1); i++) {
						//									if (handleLocation == _that._editPoints[i]) {
						//										_that._pointIndex = i;
						//										break;
						//									}
						//								}
						//							},
						//							_dragHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								var loc = e.entity.getLocation();

						//								_that._editPoints[_that._pointIndex] = loc;
						//								_that._dragHandleMdlLine.get(_that._pointIndex).setLocation(_that._getMiddlePoint(loc, _that._editPoints[_that._pointIndex + 1]));

						//								if (_that._pointIndex == 0 && (_that._editShape.toString() == '[Polygon]' || _that._editShape.toString() == '[AdvancedShapes.Polygon]')) {
						//									_that._editPoints[_that._editPoints.length - 1] = loc;
						//									_that._dragHandleMdlLine.get(_that._dragHandleMdlLine.getLength() - 1).setLocation(_that._getMiddlePoint(loc, _that._editPoints[_that._editPoints.length - 2]));
						//								}
						//								else {
						//									_that._dragHandleMdlLine.get(_that._pointIndex - 1).setLocation(_that._getMiddlePoint(loc, _that._editPoints[_that._pointIndex - 1]));
						//								}
						//								_that._shapeMask.setLocations(_that._editPoints);
						//							},
						//							_endDragHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								//Update source shape
						//								_that._editShape.setLocations(_that._editPoints);
						//							},
						//							_mouseOverDragHandle: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								//Update handle image
						//								e.target.setOptions({
						//									icon: _that._options.dragHandleImageActive
						//								});
						//								_that._onMouseOverPushpin = true;
						//								if (e.originalEvent.ctrlKey)
						//									_that._setMouseCursor('url(' + rootBase + 'Content/img/maps/remove-cursor.gif) 4 0, url(' + rootBase + 'Content/img/maps/remove-cursor.cur) 4 0, pointer');
						//								else
						//									_that._setMouseCursor('pointer');
						//							},
						//							_mouseOutDragHandle: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								//Update handle image
						//								e.target.setOptions({
						//									icon: _that._options.dragHandleImage
						//								});
						//								_that._onMouseOverPushpin = false;
						//								_that._setMouseCursor('auto');
						//							},
						//							_mouseOverDragHandleMdlLine: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								//Update handle image
						//								e.target.setOptions({
						//									icon: _that._options.dragHandleMdlLineImageActive
						//								});
						//								_that._setMouseCursor('url(' + rootBase + 'Content/img/maps/add-cursor.gif) 4 0, url(' + rootBase + 'Content/img/maps/add-cursor.cur) 4 0, pointer');
						//							},
						//							_mouseOutDragHandleMdlLine: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								//Update handle image
						//								e.target.setOptions({
						//									icon: _that._options.dragHandleMdlLineImage
						//								});
						//								_that._setMouseCursor('auto');
						//							},
						//							_mapMouseDownHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								_that._currentLocation = _geoLocationInstance.map.tryPixelToLocation(new Microsoft.Maps.Point(e.getX(), e.getY()));
						//								_that._points.push(_that._currentLocation);
						//								_that._maskPoints[0] = _that._currentLocation;

						//								switch (_that._points.length) {
						//									case 1:
						//										_that._maskPoints[1] = _that._currentLocation;
						//										_geoLocationInstance.map.entities.push(_that._maskLine);
						//										_that._mapMoveHandler = Microsoft.Maps.Events.addHandler(_geoLocationInstance.map, 'mousemove', _that._mapMouseMoveHandler);
						//										break;
						//									case 2:
						//										var opt = {
						//											strokeColor: _geoLocationInstance.polygonCreateStrokeColor,
						//											strokeThickness: _that._options.shapeStrokeThickness,
						//											strokeDashArray: _that._options.shapeStrokeDashArray,
						//											fillColor: _geoLocationInstance.polygonCreateFillColor
						//										};
						//										_that._shape = new Microsoft.Maps.Polygon(_that._points, opt);
						//										//_that._shape.shapeType = 'polygon'; //_options.shapeType;
						//										_geoLocationInstance.map.entities.push(_that._shape);
						//										break;
						//									default:
						//										_that._maskLine.setLocations(_that._maskPoints);
						//										_that._shape.setLocations(_that._points);
						//										break;
						//								}
						//								e.handled = true;
						//							},
						//							_mapMouseMoveHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								_that._setMouseCursor("crosshair");
						//								var _tempLocation = _geoLocationInstance.map.tryPixelToLocation(new Microsoft.Maps.Point(e.getX(), e.getY()));

						//								_that._maskPoints[1] = _tempLocation;
						//								_that._maskLine.setLocations(_that._maskPoints);

						//								e.handled = true;
						//							},
						//							_keyPressHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								if (_that._getKeycode(e) == '27') {
						//									_that._dispose();
						//								}
						//								e.handled = true;
						//							},
						//							_doubleClickHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								_that._dispose();
						//								e.handled = true;
						//							},
						//							_editKeyPressHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;
						//								if (_that._getKeycode(e) == '27') {
						//									_that._editDispose();
						//								}
						//								else if (_that._getKeycode(e) == '17') {
						//									_that._ctrlKey = false;
						//									if (_that._onMouseOverPushpin) {
						//										_that._setMouseCursor('pointer');
						//									}
						//								}
						//								//                            else if (_that._getKeycode(e) == '46') {    //delete key handler
						//								//                                _that._editDispose(true);
						//								//                            }

						//								if (e) {
						//									e.handled = true;
						//								}
						//							},
						//							_editKeyDownHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;

						//								if (_that._getKeycode(e) == '17') {
						//									_that._ctrlKey = true;
						//									if (_that._onMouseOverPushpin) {
						//										_that._setMouseCursor('url(' + rootBase + 'Content/img/maps/remove-cursor.gif) 4 0, url(' + rootBase + 'Content/img/maps/remove-cursor.cur) 4 0, pointer');
						//									}
						//								}
						//								if (e) {
						//									e.handled = true;
						//								}
						//							},
						//							_pushpinClickHandler: function (e) {
						//								var _that = _geoLocationInstance.pushpinEdition;

						//								if (_that._ctrlKey) {
						//									var _pushpinIndex = undefined;
						//									//Determine point index
						//									for (i = 0; i <= (_that._editPoints.length - 1); i++) {
						//										if (e.target.getLocation() == _that._editPoints[i]) {
						//											_pushpinIndex = i;
						//											_that._editPoints.splice(i, 1);
						//											break;
						//										}
						//									}
						//									_that._dragHandleMdlLine.removeAt(_pushpinIndex);
						//									if (_pushpinIndex == 0 && _that._editPoints.length) {
						//										_that._editPoints[_that._editPoints.length - 1] = _that._editPoints[0];
						//										_that._dragHandleMdlLine.get(_that._dragHandleMdlLine.getLength() - 1).setLocation(_that._getMiddlePoint(_that._editPoints[_pushpinIndex], _that._editPoints[_that._editPoints.length - 2]));
						//									}
						//									else {
						//										_that._dragHandleMdlLine.get(_pushpinIndex - 1).setLocation(_that._getMiddlePoint(_that._editPoints[_pushpinIndex], _that._editPoints[_pushpinIndex - 1]));
						//									}
						//									_that._shapeMask.setLocations(_that._editPoints);
						//									_that._editShape.setLocations(_that._editPoints);
						//									_that._dragHandleLayer.removeAt(_pushpinIndex);
						//								}
						//								if (e) {
						//									e.handled = true;
						//								}
						//							},
						//							_getKeycode: function (e) {
						//								if (window.event) {
						//									return window.event.keyCode;
						//								}
						//								else if (e.keyCode) {
						//									return e.keyCode;
						//								}
						//								else if (e.which) {
						//									return e.which;
						//								}
						//							},
						//							toggleEditMode: function () {
						//								var _that = this;
						//								if (_that._isCreatingPolygon) {
						//									_that._dispose();
						//								} else {
						//									if (_geoLocationInstance.beginUpdatePolygonHandler)
						//										_geoLocationInstance.beginUpdatePolygonHandler();
						//									_that.draw();
						//								}
						//							},
						//							draw: function () {
						//								var _that = this;
						//								if (_that._isCreatingPolygon) {
						//									_that._dispose();
						//									if (_geoLocationInstance.endUpdatePolygonHandler)
						//										_geoLocationInstance.endUpdatePolygonHandler();
						//								}
						//								_that._init();
						//							},
						//							edit: function (shape) {
						//								var _that = this;
						//								if (shape) {
						//									_that._editShape = shape;
						//									_that._initEdit();
						//								}
						//							}
						//						};

						this.icons = {
							init: function () {
								this.grayUserIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/user_gray.png', 26, 35, -1, 5);
								this.blueUserIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/user_blue.png', 26, 35, -1, 5);
								this.redUserIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/user_red.png', 26, 35, -1, 5);
								this.orangeUserIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/user_orange.png', 26, 35, -1, 5);
								this.greenUserIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/user_green.png', 26, 35, -1, 5);
								this.buildingIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/tag_building.png', 26, 35, -1, 5);
								this.blueIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/tag_blue.png', 26, 35, -1, 5);
								this.redIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/tag_red.png', 26, 35, -1, 5);
								this.orangeIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/tag_orange.png', 26, 35, -1, 5);
								this.greenIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/tag_green.png', 26, 35, -1, 5);
								this.smallRedIcon = new _geoLocationInstance.type.Icon(rootBase + 'Content/img/maps/smallRedPoint.png', 3, 3, -1, 5);
							}
						};

						this.type = {
							Location: function (latitude, longitude) {
								this.Latitude = typeof latitude !== 'undefined' ? latitude : 0;
								this.Longitude = typeof longitude !== 'undefined' ? longitude : 0;
							},
							Pushpin: function (id, location, number, title, description, actions, icon, hasInfobox, options) {
								this.Id = id;
								this.Location = typeof location !== 'undefined' ? location : new _geoLocationInstance.type.Location();
								this.Number = number;
								this.Title = title;
								this.Description = description;
								this.Icon = icon;
								this.HasInfobox = hasInfobox;
								this.Actions = typeof actions !== 'undefined' ? actions : [];
								this.getLocation = function () {
									return this.Location;
								}
							},
							Polygon: function (locations, title, description, actions, icon, hasInfobox) {
								this.Locations = typeof locations !== 'undefined' ? locations : [];
								this.Title = title;
								this.Description = description;
								this.Icon = icon;
								this.HasInfobox = hasInfobox;
								this.Actions = typeof actions !== 'undefined' ? actions : [];
							},
							Icon: function (url, width, height, textOffsetX, textOffsetY) {
								this.Url = url;
								this.Width = typeof width !== 'undefined' ? width : 25;
								this.Height = typeof height !== 'undefined' ? height : 39;
								this.TextOffsetX = typeof textOffsetX !== 'undefined' ? textOffsetX : 0;
								this.TextOffsetY = typeof textOffsetY !== 'undefined' ? textOffsetY : 5;
							},
							HtmlContent: function (content) {
								this.HtmlContent = content;
							}
						};


						var _mapLayer;
						if (!options.hasOwnProperty('mapLayer')) {
							throw 'mapLayer property is required';
							return;
						}
						if (options.hasOwnProperty('mode')) {
							_geoLocationInstance.mode = options['mode'];
						}
						if (options.hasOwnProperty('viewMapBoundsDelta')) {
							_geoLocationInstance.viewMapBoundsDelta = options['viewMapBoundsDelta'];
						}
						var _showBreadcrumb = options.hasOwnProperty('showBreadcrumb') ? options['showBreadcrumb'] : true;
						var _showUi = options.hasOwnProperty('showUi') ? options['showUi'] : true;

						var _showScale = _showUi, _showDashboard = _showUi, _showMapTypeSelector = _showUi;
						if (options.hasOwnProperty('uiFeatures') && options['uiFeatures']) {
							_showScale = options['uiFeatures'].indexOf('scale') > -1;
							_showMapTypeSelector = options['uiFeatures'].indexOf('mapType') > -1;
							_showDashboard = options['uiFeatures'].indexOf('dashboard') > -1;
							_showBreadcrumb = (!!_showBreadcrumb) || (options['uiFeatures'].indexOf('breadcrumb') > -1);
						}

						var _mapType = options.hasOwnProperty('mapType') ? options['mapType'] : Microsoft.Maps.MapTypeId.aerial;

						_geoLocationInstance.userDoubleClickHandler = options.hasOwnProperty('userDoubleClickHandler') ? options['userDoubleClickHandler'] : undefined;
						_geoLocationInstance.userMouseDownHandler = options.hasOwnProperty('userMouseDownHandler') ? options['userMouseDownHandler'] : undefined;
						_geoLocationInstance.userKeyPressHandler = options.hasOwnProperty('userKeyPressHandler') ? options['userKeyPressHandler'] : undefined;
						_geoLocationInstance.polygonUpdateHandler = options.hasOwnProperty('polygonUpdateHandler') ? options['polygonUpdateHandler'] : undefined;
						_geoLocationInstance.beginPolygonUpdateHandler = options.hasOwnProperty('beginPolygonUpdateHandler') ? options['beginPolygonUpdateHandler'] : undefined;
						_geoLocationInstance.endPolygonUpdateHandler = options.hasOwnProperty('endPolygonUpdateHandler') ? options['endPolygonUpdateHandler'] : undefined;
						_geoLocationInstance.mapTypeUpdatedHandler = options.hasOwnProperty("mapTypeUpdatedHandler") ? options["mapTypeUpdatedHandler"] : undefined;
						_geoLocationInstance.popupOffsetX = options.hasOwnProperty('popupOffsetX') ? options["popupOffsetX"] : undefined;
						_geoLocationInstance.popupOffsetY = options.hasOwnProperty('popupOffsetY') ? options["popupOffsetY"] : undefined;

						if (options.hasOwnProperty('polygonEditFillColor')) {
							_geoLocationInstance.polygonEditFillColor = _geoLocationInstance.pushpinEdition._getColorFromCssColor(options['polygonEditFillColor']);
						}
						if (options.hasOwnProperty('polygonEditStrokeColor')) {
							_geoLocationInstance.polygonEditStrokeColor = _geoLocationInstance.pushpinEdition._getColorFromCssColor(options['polygonEditStrokeColor']);
						}
						if (options.hasOwnProperty('polygonCreateFillColor')) {
							_geoLocationInstance.polygonCreateFillColor = _geoLocationInstance.pushpinEdition._getColorFromCssColor(options['polygonCreateFillColor']);
						}
						if (options.hasOwnProperty('polygonCreateStrokeColor')) {
							_geoLocationInstance.polygonCreateStrokeColor = _geoLocationInstance.pushpinEdition._getColorFromCssColor(options['polygonCreateStrokeColor']);
						}

						_geoLocationInstance.map = new Microsoft.Maps.Map(document.getElementById(options['mapLayer']), {
							credentials: 'AsuLB3-qO7oKtnXElc6TyoypSxnncqeEgOTXpOMu4esBWzQct1JNMNS_kK3c9zy0',
							//                                credentials: 'AlgTQ4fTPMz-6xS3t5X7MgYq1TuZjywvG6pFmKb2ORcNFbM8mx0nWIAgA039JkTR',
							enableClickableLogo: false,
							enableSearchLogo: false,
							disableStreetside: true,
							mapTypeId: _mapType,
							showBreadcrumb: _showBreadcrumb,
							showLocateMeButton: _showBreadcrumb,
							showDashboard: _showUi,
							showMapTypeSelector: _showMapTypeSelector,
							showScalebar: _showScale
						});

						if (_showUi && !_showMapTypeSelector) {
							//See https://social.msdn.microsoft.com/Forums/en-US/d706fc8c-c86b-42d8-9c69-321ce7eab1cb/navigation-controls-disappear-when-showmaptypeselector-is-false?forum=bingmaps
							var showToolbar = function () {
								if ($(".OverlaysTL").length == 0) setTimeout(showToolbar, 200);
								else $(".OverlaysTL.hidden").removeClass("hidden").addClass("OverlaysTL");
							};

							showToolbar();
						}

						$('.MicrosoftMap').css('z-index', 'auto');
						_geoLocationInstance.setMode(_geoLocationInstance.mode);
						//                            _geoLocationInstance.map.getCredentials(function(credentials) {
						//                                _geoLocationInstance.sessionId = credentials;
						//                            });

						if (options['mapLoadedHandler']) {
							options['mapLoadedHandler'].apply(_geoLocationInstance, ['themes']);
						}

						if (options.enableClustering) {
							Microsoft.Maps.loadModule('Microsoft.Maps.Clustering', function () {
								if (options['mapLoadedHandler']) {
									options['mapLoadedHandler'].apply(_geoLocationInstance, ['clusters']);
								}
							});
							//							Microsoft.Maps.registerModule('clusterModule', window.rootBase + '/Content/scripts/lib/BingMaps-Clustering/V7ClientSideClustering.js');
							//							Microsoft.Maps.loadModule('clusterModule', { callback: function () {
							//								if (options['mapLoadedHandler']) {
							//									options['mapLoadedHandler'].apply(_geoLocationInstance, ['clusters']);
							//								}
							//							}
							//							});
						}

						_geoLocationInstance.icons.init();
					}
				};
			}
		};

		window.geoLocation = window.GeoLocationFactory.getNew();
	})(window);
});
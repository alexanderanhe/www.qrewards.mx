$(function() {
    var Validator = function(op) {
            var config = {
                authValidations: []
            };
            if (op.config) {
                if ('authValidations' in op.config) {
                    config.authValidations = op.config.authValidations
                }
            }
            return {
                recaptcha: function() {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    var response = grecaptcha.getResponse();
                    if (!response.length) {
                        val.messageError += "\n     -  Captcha no verificado";
                        val.validation = false;
                    }
                    return val;
                },
                conditions: function($form, selector) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (config.authValidations.indexOf('conditions') >= 0) {
                        selector = selector ? selector : '[name="conditions"]';
                        if (!$form.find(selector).is(':checked')) {
                            val.messageError = "\n     -  Debe aceptar los términos y condiciones";
                            val.validation = false;
                        }
                    }
                    return val;
                },
                code: function($form, selector) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (config.authValidations.indexOf('code') >= 0) {
                        selector = selector ? selector : '#code';
                        var code = $form.find(selector).val();
                        if (!code) {
                            val.messageError += "\n     -  El codigo esta vacio";

                        } 
                        if (val.messageError)  {
                            val.validation = true;
                        }
                    }
                    return val;
                },
                name: function($form, selector) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (config.authValidations.indexOf('name') >= 0) {
                        selector = selector ? selector : '#name';
                        var name = $form.find(selector).val();
                        if (!name) {
                            val.messageError = "\n     -  El nombre está vacio";
                            val.validation = false;
                        }
                    }
                    return val;
                },
                email: function($form, selector, selector2) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (config.authValidations.indexOf('email') >= 0) {
                        selector = selector ? selector : '#email';
                        selector2 = selector2 ? selector2 : '#email_confirm';
                        var email = $form.find(selector).val();
                        var email_confirm = $form.find(selector2).val();
                        if (!email) {
                            val.messageError += "\n     -  Correo electrónico está vacio";
                        } else if (email != email_confirm) {
                            val.messageError += "\n     -  Correo de confirmación no coincide";
                        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                            val.messageError += "\n     -  Correo electrónico incorrecto";
                        }
                        if (val.messageError)  {
                            val.validation = false;
                        }
                    }
                    return val;
                },
                telefone: function($form, selector, selector2) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    selector = selector ? selector : '#telephone_number';
                    selector2 = selector2 ? selector2 : '#telephone_confirm';
                    var cellphone = $form.find(selector).val();
                    var cellphone_confirm = $form.find(selector2).val();
                    if (!cellphone) {
                        val.messageError += "\n     -  Teléfono está vacio";
                    } else if (cellphone != cellphone_confirm) {
                        val.messageError += "\n     -  Teléfono de confirmación no coincide";
                    } else if (!/^[0-9]{10}$/.test(cellphone)) {
                        val.messageError += "\n     -  Teléfono incorrecto";
                    } 
                    if (val.messageError)  {
                        val.validation = false;
                    }
                    return val;
                },
                not_empty: function($form, selector, label) {
                    var val = {
                        messageError: '',
                        validation: true
                    };
                    if (selector) {
                        var field = $form.find(selector).val();
                        if (!field) {
                            val.messageError = "\n     -  El campo " + label + " está vacio";
                            val.validation = false;
                        }
                    }
                    return val;
                },
                recharge: function($form) {
                    var missinginfo = '';

                    missinginfo += this.not_empty($form, '#company', 'compañía').messageError +
                        this.telefone($form, '#telephone_number', '#telephone_confirm').messageError;

                    if (missinginfo) {
                        swal({
                            title: "Verifique datos!",
                            text: missinginfo,
                            icon: "info"
                        });
                        return false;
                    } else {
                        return true;
                    }
                },
                all: function($form) {
                    var missinginfo = '';

                    missinginfo += this.code($form, '#code').messageError +
                        this.recaptcha().messageError +
                        this.name($form, '#name').messageError +
                        this.email($form, '#email', '#email_confirm').messageError +
                        this.conditions($form, '[name="conditions"]').messageError;

                    if (missinginfo) {
                        swal({
                            title: "Verifique datos!",
                            text: missinginfo,
                            icon: "info"
                        });
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        };
    (function() {

        function init(site) {

            const http = new HttpClient(API_URL[ENV]);
            const validation = new Validator(site);
            const token_label = ['s', site.id, "token"].join(':');
            const user_label = ['s', site.id, "user"].join(':');
            const pathname = window.location.pathname,
                home = '/' + site.slug + '/';
            
            const redirect = function(user_data) {
                    if (typeof user_data.digital != "undefined") {
                        if (user_data.digital.apply_stock == 0) {
                            window.location.href = './app-carrier' + (ENV ? '.php' : '');
                        } else {
                            window.location.href = './app-download' + (ENV ? '.php' : '');
                        }
                    } else if (pathname) {
                        window.location.href = home;
                    }
                },
                getToken = function() {
                    return localStorage.getItem(token_label);
                },
                getUser = function() {
                    var user = localStorage.getItem(user_label);
                    return user ? JSON.parse(user) : false;
                },
                logout = function() {
                    localStorage.removeItem(token_label);
                    localStorage.removeItem(user_label);
                    window.location.href = home;
                },
                without_recharging = function(user) {
                    if (user.record) {
                        return !user.record.rchrg_id;
                    }
                    return true;
                },
                errorAlerts = function(error) {
                    if (error) {
                        if (error.error) {
                            if (typeof error.error === 'string') {
                                if (error.error.indexOf('Invalid API key') >= 0) {
                                    invalidApiKey(error.error);
                                } else {
                                    swal({
                                        title: "¡Atención!",
                                        text: error.error,
                                        icon: "info"
                                    });
                                }
                            } else {
                                swal({
                                    title: "¡Atención!",
                                    text: [error.error.error_code,
                                        error.error.description
                                    ].join(':'),
                                    icon: "info"
                                });
                            }
                        }
                    }
                },
                invalidApiKey = function(error) {
                    swal({
                        title: "Atención!",
                        text: 'Su session a finalizado, por favor intente nuevamente [' + error + ']',
                        icon: "info"
                    }).then(() => {
                        logout();
                    });
                },
                carrier_page = function(user) {
                    var token = getToken();
                    if (token) {
                        $('[name="company"]').on('input', function(e) {
                            if ($(this).is(':checked')) {
                                $('#company').val($(this).data('company'));
                            }
                        });
                    }
                };
            

            if (pathname != home && !localStorage.getItem(token_label)) {
                window.location.href = home;
            } else {
                var user = getUser();
                if (user) {
                    if (user.valid_date) {
                        $('.valid_date_day').html(user.valid_date.day);
                        $('.valid_date_hour').html(user.valid_date.hour);
                    }
                    if (user.record) {
                        $('.user_name').html(user.record.name);
                        $('.user_email').html(user.record.email);
                    }
                    const path = pathname.split('/');
                    const page = path[path.length-1];
                    switch (page) {
                      case 'app-carrier':
                      case 'app-carrier.php':
                        carrier_page();
                        break;
                      case 'page.php':
                        // window.location.href = './profile_user.php';
                      break;
                    }
                    if (user.record.email) {
                        $('.user_email').html(user.record.email);
                    }
                }
                if (pathname == home || pathname == (home + '/index.php')) {
                    localStorage.removeItem(token_label);
                    localStorage.removeItem(user_label);
                }
            }

            // auth request
            $("form.banorte-auth").submit(function(event) {
                event.preventDefault();
                var $btn = $(this).find('button[type=submit],input[type=submit]');
                var valForm = validation.all($(this));
                if (valForm) {
                    var code = $(this).find('#code');
                    $btn.prop('disabled', true).html('ENVIANDO...');
                    http.get('/sites/' + site.slug + '/auth/' + code.val(), $(this).serialize())
                        .done(function(data) {
                            if (data.data) {
                                var req = data.data;
                                localStorage.setItem(token_label, req.token);
                                localStorage.setItem(user_label, JSON.stringify(req.user));
                                redirect(req.user);
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            errorAlerts(jqXHR.responseJSON);
                        })
                        .always(function() {
                            code.val('').focus();
                            grecaptcha.reset();
                            $btn.prop('disabled', false).html('CONTINUAR');
                        });
                        
                }
            });

            // Update user info
            $("form.qrewards-form").submit(function(event) {
                event.preventDefault();
                var valForm = validation.recharge($(this));
                if (valForm) {
                    var token = getToken();
                    if (token) {
                        var $telephone = $(this).find('#telephone_number'),
                        $company = $(this).find('#company');
                        http.put('/sites/record', {
                                'client': site.slug,
                                'info': {
                                    'cellphone': $telephone.val(),
                                    'cellphone_company': $company.val()
                                }
                            }, {
                                'X-API-KEY': token
                            })
                            .done(function(data) {
                                var req = data.data;
                                if (req) {
                                    http.get(['/sites', site.slug, 'download'].join('/'), {
                                        'rchrg_cellphone': $telephone.val(),
                                        'rchrg_company': $company.val()
                                        }, {
                                            'X-API-KEY': token
                                        })
                                        .done(function(data) {
                                            var req_source = data.data;
                                            if (req_source) {
                                                if (req_source.sources.recharges.length) {
                                                    if (req_source.sources.recharges[0]) {
                                                        window.location.href = './recarga-exitosa.php';
                                                    } else {
                                                        window.location.href = './error-recarga.php?codigoRespuesta=1&codigoRespuestaDescr=Servicio+no+disponible';
                                                    }
                                                } else error();
                                            } else error();
                                        })
                                        .fail(function(jqXHR, textStatus, errorThrown) {
                                            errorAlerts(jqXHR.responseJSON);
                                        });
                                }
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                if (typeof jqXHR.responseJSON.error.error_code === 'undefined') {
                                    invalidApiKey(jqXHR.responseJSON.error);
                                } else {
                                    swal({
                                        title: "Error!",
                                        text: [jqXHR.responseJSON.error.error_code,
                                            jqXHR.responseJSON.error.description
                                        ].join(':'),
                                        icon: "error"
                                    });
                                }
                            })
                            .always(function() {
                                $("form.qrewards-form").find('input, select').first().focus();
                            });
                    } else {
                        swal({
                            title: 'Error!',
                            text: 'Error al intentar obtener token de autenticación',
                            icon: 'error'
                        });
                        window.location.href = home;
                    }
                }
            });

            $(".btn-printer").submit(function(event) {
                event.preventDefault();
                var $btn = $(this).find('button[type=submit],input[type=submit]');
                var token = getToken();
                if (token) {
                    $btn.prop('disabled', true).html('DESCARGANDO...');
                    http.get(['/sites', site.slug, 'download'].join('/'), {}, {
                            'X-API-KEY': token
                        })
                        .done(function(data) {
                            var req = data.data;
                            if (req) {
                                var url_coupon = API_URL[ENV] + '/public/pdf/dompdf.php?i=' + req.sources.media;
                                if (req.device_os_mobile || ENV === 1) {
                                    window.location.replace(url_coupon);
                                } else {
                                    $('#container-iframe').attr('src', url_coupon);
                                }
                            } else {
                                swal({
                                    title: "Algo está mal!",
                                    icon: "info"
                                });
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            if (typeof jqXHR.responseJSON.error.error_code === 'undefined') {
                                invalidApiKey(jqXHR.responseJSON.error);
                            } else if (jqXHR.responseJSON.error.error_code < 2000) {
                                swal({
                                    title: "Error!",
                                    text: [jqXHR.responseJSON.error.error_code,
                                        jqXHR.responseJSON.error.description
                                    ].join(':'),
                                    icon: "info"
                                });
                            } else {
                                swal({
                                    title: "Atención!",
                                    text: jqXHR.responseJSON.error.description + '.',
                                    icon: "info"
                                }).then(() => {
                                    logout();
                                });
                            }
                        })
                        .always(function() {
                            $btn.prop('disabled', false).html('Imprime tu cupón');
                        });
                }
            });

            $(".btn-logout").click(function(event) {
                event.preventDefault();
                logout();
            });
        }
        window.init = init;
    })();
    
});
$(document).ready(function() {
    if (slug_site) {
        $.get(API_URL[ENV] + '/sites/' + slug_site + '/info', function(data) {
            if (data.data) {
                init(data.data);
            }
        });
    } else {
        alert('Error al cargar página!');
    }
});
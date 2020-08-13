'use strict'

const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const auth = require('../middlewares/auth');


function commands(req, res) {
    let user = new User();
    let tweet = new Tweet();
    let params = req.body;
    let arrUserData = Object.values(params);
    let resp = arrUserData.toString().split(" ");


    switch (resp[0]) {
        case 'register':
            if (resp[1] != null && resp[2] != null && resp[3] != null && resp[4] != null) {
                User.findOne({ $or: [{ email: resp[2] }, { username: resp[3] }] }, (err, userFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (userFind) {
                        res.send({ message: 'El usuario o correo ingresado ya esatn registrados' });
                    } else {
                        user.name = resp[1];
                        user.email = resp[2];
                        user.username = resp[3];
                        user.password = resp[4];

                        bcrypt.hash(resp[4], null, null, (err, hashPass) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al encriptar' });
                            } else {
                                user.password = hashPass;
                                user.save((err, userSaved) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error en el servidor' });
                                    } else if (userSaved) {
                                        res.send({ user: userSaved })
                                    } else {
                                        res.status(404).send({ message: 'Error Al registrarse' });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.status(404).send({ message: 'Debe ingresar todos los datos requeridos' })
            }
            break;

        case 'login':
            if (resp[1] != null && resp[2] != null) {
                User.findOne({ $or: [{ username: resp[1] }, { email: resp[1] }] }, (err, userFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (userFind) {
                        bcrypt.compare(resp[2], userFind.password, (err, checkPass) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor.' });
                            } else if (checkPass) {
                                if (resp[3] == 'true') {
                                    res.send({ token: jwt.createToken(userFind) });
                                } else {
                                    res.send({ user: userFind });
                                }
                            } else {
                                res.status(404).send({ message: 'Contraseña incorrecta.' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'Usuario ingresado no encontrado' });
                    }
                });
            } else {
                res.status(404).send({ message: 'Debe ingresar todos los datos requeridos' });
            }
            break;

        case 'add_tweet':
            if (resp[1] != null) {
                tweet.content = resp.join(' ');
                tweet.content = tweet.content.replace('add_tweet', '');
                tweet.content = tweet.content.replace(' ', '');
                tweet.user = auth.username;

                if (tweet.content.length <= 280) {
                    User.findByIdAndUpdate(auth.idUser, { $inc: { noTweets: 1 } }, { new: true }, (err, userUpdate) => {
                        if (err) {
                            res.status(500).send({ message: 'Problema con el servidor' });
                        } else if (userUpdate) {
                            tweet.save((err, tweetSaved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en el servidor' });
                                } else if (tweetSaved) {
                                    res.send({ tweet: tweetSaved });
                                } else {
                                    res.status(404).send({ message: 'Error al agregar tweet' });
                                }
                            });
                        } else {
                            res.status(404).send({ message: 'Error al agregar tweet' })
                        }
                    });
                } else {
                    res.status(404).send({ message: 'No debe exceder mas de 280 caracteres' });
                }
            } else {
                res.status(404).send({ message: 'debe ingresar contenido al Tweet' });
            }
            break;

        case 'edit_tweet':
            if (resp[1] != null) {
                if (resp[2] != null) {
                    let content = tweet.content;
                    content = resp.join(' ');
                    content = content.replace('edit_tweet', '');
                    content = content.replace(resp[1], '');
                    content = content.replace('  ', '');

                    if (content.length <= 280) {
                        let update = content;
                        Tweet.findByIdAndUpdate(resp[1], { $set: { content: update } }, { new: true }, (err, tweetUpdated) => {
                            if (err) {
                                res.status(500).send({ message: 'Problema con el servidor' });
                            } else if (tweetUpdated) {
                                res.send({ tweet: tweetUpdated });
                            } else {
                                res.status(404).send({ message: 'problema al editar tweet' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'No debe exceder mas de 280 caracteres' });
                    }
                } else {
                    res.status(404).send({ message: 'debe ingresar nuevo contenido del tweet' });
                }
            } else {
                res.status(404).send({ message: 'Debe ingresar el id del tweet' });
            }
            break;

        case 'delete_tweet':
            if (resp[1] != null) {
                Tweet.findByIdAndRemove(resp[1], (err, tweetFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (tweetFind) {
                        User.findByIdAndUpdate(auth.idUser, { $inc: { noTweets: -1 } }, { new: true }, (err, noTweets) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (noTweets) {
                                res.send({ message: 'ha sido eliminado el tweet' });
                            } else {
                                res.status(404).send({ message: 'Error al decrementar numero de tweets' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'tweet no encontrado' });
                    }
                });
            } else {
                res.status(404).send({ message: 'Debe ingresar el id del tweet' });
            }
            break;

        case 'view_tweets':
            if (resp[1] != null) {
                Tweet.findOne({ user: { $regex: resp[1], $options: 'i' } }, (err, tweetsFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (tweetsFind) {
                        Tweet.find({ user: { $regex: resp[1], $options: 'i' } }, (err, tweets) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (tweets) {
                                res.send({ tweets: tweets });
                            } else {
                                res.status(404).send({ message: 'problema al mostrar tweets' });
                            }
                        }).populate('retweet');
                    } else {
                        res.status(404).send({ message: 'Usuario sin tweets' });
                    }
                });
            } else {
                res.status(404).send({ message: 'Debe ingresar el id del usuario' });
            }
            break;


        case 'follow':
            if (resp[1] != null) {
                if (auth.username === resp[1]) {
                    res.status(404).send({ message: 'imposible seguirte a ti mismo' });
                } else {
                    User.findOne({ username: resp[1], followers: auth.username }, (err, followerFind) => {
                        if (err) {
                            res.status(500).send({ message: 'Problema con el servidor' });
                        } else if (followerFind) {
                            res.send({ message: 'Ya sigues a este usuario' });
                        } else {
                            User.findOneAndUpdate({ username: resp[1] }, { $push: { followers: auth.username } }, { new: true }, (err, followed) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en el servidor' });
                                } else if (followed) {
                                    User.findOneAndUpdate({ username: resp[1] }, { $inc: { noFollowers: 1 } }, { new: true }, (err, noFollowers) => {
                                        if (err) {
                                            res.status(500).send({ message: 'Error en el servidor' });
                                        } else if (noFollowers) {
                                            res.send({ message: 'siguiendo a ' + resp[1] });
                                        } else {
                                            res.status(404).send({ message: 'problema al aumentar la cantidad de seguidores.' });
                                        }
                                    });
                                } else {
                                    res.status(404).send({ message: 'Error al seguir a ' + resp[1] });
                                }
                            });
                        }
                    });
                }
            } else {
                res.status(404).send({ message: 'debe ingresar el usuario a quien deseas seguir.' });
            }
            break;

        case 'unfollow':
            if (resp[1] != null) {
                User.findOne({ username: resp[1], followers: auth.username }, (err, followerFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (followerFind) {
                        User.findOneAndUpdate({ username: resp[1] }, { $pull: { followers: auth.username } }, { new: true }, (err, followed) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (followed) {
                                User.findOneAndUpdate({ username: resp[1] }, { $inc: { noFollowers: -1 } }, { new: true }, (err, noFollowers) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error en el servidor' });
                                    } else if (noFollowers) {
                                        res.send({ message: 'unFollow a ' + resp[1] });
                                    } else {
                                        res.status(404).send({ message: 'No se ha podido decrementar la cantidad de seguidores.' });
                                    }
                                });
                            } else {
                                res.status(404).send({ message: 'problema al dejar de seguir a ' + resp[1] });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'Tu no sigues a este usuario' });
                    }
                });
            } else {
                res.status(404).send({ message: 'debe ingresar al usuario que desea seguir ' });
            }
            break;

        case 'profile':
            if (resp[1] != null) {
                User.findOne({ username: { $regex: resp[1], $options: 'i' } }, (err, tweets) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (tweets) {
                        User.find({ username: resp[1] }, { noFollowers: 1, noTweets: 1, _id: 0, email: 1, name: 1, followers: 1 }, (err, userFind) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor.' });
                            } else if (userFind) {
                                res.send({ message: userFind });
                            } else {
                                res.status(404).send({ message: 'error al mostrar el perfil' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'problema al encontrar el usuario.' });
                    }
                });
            } else {
                res.status(404).send({ message: 'Ingresa el nombre de usuario' });
            }
            break;

        case 'like':
            if (resp[1] != null) {
                Tweet.findById(resp[1], (err, findTweet) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (findTweet) {
                        let user = findTweet.user;
                        User.findOne({ username: { $regex: user, $options: 'i' } }, (err, userFind) => {
                            if (err) {
                                res.status(500).send({ message: 'Problema con el servidor 1' });
                            } else if (userFind) {
                                let idUser = userFind.id;
                                User.findOne({ _id: idUser, followers: auth.username }, (err, follower) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Problema con el servidor 2' });
                                    } else if (follower) {
                                        Tweet.findOne({ _id: resp[1], likes: auth.username }, (err, likesFind) => {
                                            if (err) {
                                                res.status(500).send({ message: 'Error en el servidor' });
                                            } else if (likesFind) {
                                                res.send({ message: 'este tweet ya tiene tu like' });
                                            } else {
                                                Tweet.findByIdAndUpdate(resp[1], { $push: { likes: auth.username } }, { new: true }, (err, liked) => {
                                                    if (err) {
                                                        res.status(500).send({ message: 'Problema con el servidor 3' });
                                                    } else if (liked) {
                                                        Tweet.findByIdAndUpdate(resp[1], { $inc: { numberLikes: 1 } }, { new: true }, (err, noLikes) => {
                                                            if (err) {
                                                                res.status(500).send({ message: 'Error en el servidor' });
                                                            } else if (noLikes) {
                                                                res.send({ message: 'le has dado like a este tweet' });
                                                            } else {
                                                                res.status(404).send({ message: 'problema al aumentar la cantidad de likes' });
                                                            }
                                                        });
                                                    } else {
                                                        res.status(404).send({ message: 'problema al darle like' });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(404).send({ message: 'Debes seguir a este usuario para poder darle likes a sus tweets' });
                                    }
                                });
                            } else {
                                res.status(404).send({ message: 'Usuario no encontrado' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'error al encontrar el tweet' });
                    }
                });
            } else {
                res.status(404).send({ message: 'debe ingresar el id del Tweet' });
            }
            break;

        case 'dislike':
            if (resp[1] != null) {
                Tweet.findOne({ _id: resp[1], likes: auth.username }, (err, likesFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (likesFind) {
                        Tweet.findByIdAndUpdate(resp[1], { $pull: { likes: auth.username } }, { new: true }, (err, liked) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (liked) {
                                Tweet.findByIdAndUpdate(resp[1], { $inc: { numberLikes: -1 } }, { new: true }, (err, noLikes) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Problema con el servidor 1' });
                                    } else if (noLikes) {
                                        res.send({ message: 'dislike completo' });
                                    } else {
                                        res.status(404).send({ message: 'problema al decrementar cantidad de likes' });
                                    }
                                });
                            } else {
                                res.status(404).send({ message: 'Dislike in Completo' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'No se ha realizado el dislike' });
                    }
                });
            } else {
                res.status(404).send({ message: 'debe ingresar el id del tweet' });
            }
            break;

        case 'comment':
            if (resp[1] != null) {
                if (resp[2] != null) {
                    Tweet.comments = resp.join(' ');
                    Tweet.comments = Tweet.comments.replace('reply', '');
                    Tweet.comments = Tweet.comments.replace(resp[1], '');
                    Tweet.comments = Tweet.comments.replace('  ', '');
                    let comment = Tweet.comments;

                    if (Tweet.comments.length <= 280) {
                        Tweet.findByIdAndUpdate(resp[1], { $inc: { numberComments: 1 } }, { new: true }, (err, tweetUpdate) => {
                            if (err) {
                                res.status(500).send({ message: 'Problema con el servidor' });
                            } else if (tweetUpdate) {
                                Tweet.findByIdAndUpdate(resp[1], { $push: { comments: { reply: comment, user: auth.username } } }, { new: true }, (err, tweetSaved) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error en el servidor' });
                                    } else if (tweetSaved) {
                                        res.send({ tweet: tweetSaved });
                                    } else {
                                        res.status(404).send({ message: 'no se logro responder al tweet' });
                                    }
                                });
                            } else {
                                res.status(404).send({ message: 'no se logro responder al tweet' })
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'Respuesta mayor a 280 caracteres' });
                    }
                } else {
                    res.status(404).send({ message: 'debe ingresar contenido' });
                }
            } else {
                res.status(404).send({ message: 'debe ingresar el id del tweet' });
            }
            break;

        case 'retweet':
            if (resp[1] != null) {
                tweet.content = resp.join(' ');
                tweet.content = tweet.content.replace('retweet', '');
                tweet.content = tweet.content.replace(resp[1], '');
                tweet.content = tweet.content.replace('  ', '');
                let content = tweet.content;


                tweet.save((err, tweetFind) => {
                    if (err) {
                        res.status(500).send({ message: 'Problema con el servidor' });
                    } else if (tweetFind) {
                        let idTweet = tweetFind.id;
                        User.findByIdAndUpdate(auth.idUser, { $inc: { noTweets: 1 } }, { new: true }, (err, noTweets) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (noTweets) {
                                Tweet.findByIdAndUpdate(resp[1], { $inc: { numberRetweets: 1 } }, { new: true }, (err, noRetweet) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Problema con el servidor 1' });
                                    } else if (noRetweet) {
                                        Tweet.findByIdAndUpdate(idTweet, { $set: { content: content, retweet: resp[1], user: auth.username } }, { new: true }, (err, retweet) => {
                                            if (err) {
                                                res.status(500).send({ message: 'Error en el servidor' });
                                            } else if (retweet) {
                                                res.send({ tweet: retweet });
                                            } else {
                                                res.send({ message: 'Error al retweetear' });
                                            }
                                        }).populate('retweet');
                                    } else {
                                        res.status(404).send({ message: 'problema al incrementar la cantidad de retweets' });
                                    }
                                });
                            } else {
                                res.status(404).send({ message: 'problema al incrementar la cantidad de tweets.' });
                            }
                        });
                    } else {
                        res.status(404).send({ message: 'No has podido retweetear' });
                    }
                });
            } else {
                res.status(404).send({ message: 'debe ingresar el id del tweet' });
            }
            break;

        default:
            res.status(404).send({ message: 'Por favor, ingresa un comando' });
            break;
    }
}


module.exports = {
    commands
}
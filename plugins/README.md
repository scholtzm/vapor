# Vapor Plugins Folder

All Vapor plugins are loaded from this folder.

### Installing plugins

All plugins can be easily installed using git.

In this example, we will install simple plugin to handle our friends list.

```sh
$ git clone https://github.com/scholtzm/vapor-friendslist.git
```

Next, go to your Vapor config file and update `plugins` array:

`"plugins": [ "vapor-friendslist" ]`

Your plugin is ready to be used.

### Individual settings

Some plugins use individual config files.
Read their READMEs to find out how you can change the config file.

# Vapor Plugins Folder

All Vapor plugins should keep their extra files in this folder.

### Usage

If a plugin needs to store any extra files, it's recommended to use this particular folder.
There's a helper method available in `Vapor.extension` which will return correct plugin path for specific plugin
as well as specific user.

**This is important** because extra files should be stored per user, not per plugin.

#### `Vapor.extension.getPluginFolderPath(pluginName)` -> string

This function creates subfolder (if it doesn't exist) for the given `pluginName` and current user
and then returns the full path to specific plugin folder.

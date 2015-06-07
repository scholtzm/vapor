# Vapor Plugins Folder

All Vapor plugins should keep their extra files in this folder.

### Usage

If a plugin needs to store any extra files, it should use this folder
and create another subfolder specifically for its use.

There's a helper method available in `Vapor.extension`.

#### `Vapor.extension.getPluginFolderPath(pluginName)` -> string

This function creates subfolder (if it doesn't exist) for the given `pluginName`
and then returns the full path to specific plugin folder.

# Developers

You can interface with AEC in a number of ways.

The most straight-forward way is to include its main class file and call up AEC objects right away. The article on [code](developers/02-code) gives some details on that.

If you want to call up AEC from the outside, AEC has an [API](developers/03-api) that offers an interface for that.

There are many ways to extend functionality in AEC and you can write your own extensions if you'd like. By writing your own [Micro Integration](developers/04-custom-mi), you can integrate AEC with a service or another component in Joomla (maybe your own?) or extend basic business logic in general. Of course, you can also integrate with a [payment processor](developers/05-custom-processor) that is not supported yet. Finally, you can also write your own [toolbox tool](developers/06-custom-tool).

When you program extensions for AEC, there are a number of [helpers](developers/07-helpers) that you can use - classes and methods to include - that help with common tasks.

One last note, in case you want to go into the database tables - AEC uses a special format for [encoded fields](developers/01-database).

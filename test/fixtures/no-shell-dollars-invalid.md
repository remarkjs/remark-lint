An indented code block is ignored:

    $ echo a
    $ echo a > file

An unflagged fenced code block is also ignored:

```
$ echo a
$ echo a > file
```

Flagged fenced code blocks:

```sh
$ echo a
$ echo a > file
```

```bash
$ echo a

$ echo a > file
```

```command
$ echo a
$ echo a > file
```

Nested:

>   *   Hello blocks without language are also ignored:
>
>           $ echo a
>           $ echo a > file

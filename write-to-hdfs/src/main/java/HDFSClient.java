
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;

import java.io.*;
public class HDFSClient {
    private final FileSystem fs;
    private final FSDataOutputStream out;


    public HDFSClient(URI uri, String targetPath) throws URISyntaxException, IOException {
        Configuration conf = new Configuration();
        conf.setBoolean("dfs.support.append", true);
        this.fs = FileSystem.get(uri, conf);
        Path hdfsPath = new Path(targetPath);
        if (fs.exists(hdfsPath)) {
            out = fs.append(hdfsPath);
        } else {
            out = fs.create(hdfsPath);
        }

    }

    public void write(String value) throws IOException {

        out.writeBytes(value+"\n");

    }

    public void close() throws Exception{
        out.close();
        fs.close();
    }

}

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class HDFSClient {
    private final FileSystem fs;
    private final FSDataOutputStream out;


    public HDFSClient(URI uri, String targetPath) throws URISyntaxException, IOException {
        this.fs = FileSystem.get(uri, new Configuration());
        this.out = fs.create(new Path(targetPath));
    }

    public void write(String value) throws IOException {
        out.writeUTF(value);

    }

    public void close() throws Exception{
        out.close();
        fs.close();
    }

}
package uk.ac.ic.wlgitbridge.writelatex.api.request.getdoc.exception;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import uk.ac.ic.wlgitbridge.writelatex.api.request.push.exception.SnapshotPostException;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by Winston on 08/11/14.
 */
public class InvalidProjectException extends SnapshotPostException {

    private List<String> errors;

    public InvalidProjectException(JsonObject json) {
        super(json);
    }

    public InvalidProjectException() {
        super();
        errors = new LinkedList<String>();
    }

    @Override
    public String getMessage() {
        return "invalid project";
    }

    @Override
    public List<String> getDescriptionLines() {
        return errors;
    }

    @Override
    public void fromJSON(JsonElement json) {
        errors = new LinkedList<String>();
        JsonArray errors = json.getAsJsonObject().get("errors").getAsJsonArray();
        for (JsonElement error : errors) {
            this.errors.add(error.getAsString());
        }
    }
}

<?php

/**
 * The Infoscreen model class
 * @author Jens
 */
class Infoscreen extends Model {
    
    /**
     * Get infoscreen information from the database
     * @param string $alias
     * @return object
     */
    function get($alias) {
        $query = $this->db->query("SELECT * FROM infoscreens WHERE alias = ? LIMIT 0,1", array($alias));
        return $query->row();
    }
    
    /**
     * Get all turtles of an infoscreen
     * @param int $infoscreen_id
     * @return array
     */
    function turtles($infoscreen_id) {
        $query = $this->db->query("SELECT * FROM turtles WHERE infoscreen_id = ?", $infoscreen_id);
        $turtles = $query->result();
        
        foreach ($turtles as &$turtle) {
            // standard options
            $turtle->options = array("colspan" => $turtle->colspan, "group" => $turtle->group, "source" => $turtle->source);
            
            // optional options
            $options = $this->turtleOptions($turtle->id);
            foreach($options as $option) {
                // if multiple options are found with the same name they are storred in an array
                if(isset($turtle->options[$option->key])) {
                    if(is_array($turtle->options[$option->key])) {
                        $turtle->options[$option->key][] = $option->value;
                    }
                    else {
                        $turtle->options[$option->key] = array($turtle->options[$option->key], $option->value);
                    }
                }
                else {
                    $turtle->options[$option->key] = $option->value;
                }
            }
        }
        
        return $turtles;
    }
    
    /**
     * Get turtle options
     * @param int $turtle_id
     * @return array
     */
    function turtleOptions($turtle_id) {
        $query = $this->db->query("SELECT * FROM turtle_options WHERE turtle_id = ?", $turtle_id);
        return $query->result();
    }
}